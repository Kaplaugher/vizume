import { useState, useRef, useEffect } from "react";
import {
  createAudioMixer,
  setupRecording,
  cleanupRecording,
  createRecordingBlob,
  calculateRecordingDuration,
} from "@/lib/utils";

// Webcam-specific function to get camera and microphone streams
const getWebcamStreams = async (
  withMic: boolean
): Promise<{ cameraStream: MediaStream; micStream: MediaStream | null; hasCameraAudio: boolean }> => {
  const cameraStream = await navigator.mediaDevices.getUserMedia({
    video: {
      width: { ideal: 1920 },
      height: { ideal: 1080 },
      frameRate: { ideal: 30 },
    },
    audio: true,
  });

  const hasCameraAudio = cameraStream.getAudioTracks().length > 0;
  let micStream: MediaStream | null = null;

  if (withMic && !hasCameraAudio) {
    // Only request separate mic if camera doesn't have audio
    try {
      micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStream
        .getAudioTracks()
        .forEach((track: MediaStreamTrack) => (track.enabled = true));
    } catch (error) {
      console.warn("Could not access microphone:", error);
    }
  }

  return { cameraStream, micStream, hasCameraAudio };
};

export const useWebcamRecording = () => {
  const [state, setState] = useState<BunnyRecordingState>({
    isRecording: false,
    recordedBlob: null,
    recordedVideoUrl: "",
    recordingDuration: 0,
  });

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<ExtendedMediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      stopRecording();
      if (state.recordedVideoUrl) URL.revokeObjectURL(state.recordedVideoUrl);
      audioContextRef.current?.close().catch(console.error);
    };
  }, [state.recordedVideoUrl]);

  const handleRecordingStop = () => {
    const { blob, url } = createRecordingBlob(chunksRef.current);
    const duration = calculateRecordingDuration(startTimeRef.current);

    setState((prev) => ({
      ...prev,
      recordedBlob: blob,
      recordedVideoUrl: url,
      recordingDuration: duration,
      isRecording: false,
    }));
  };

  const startRecording = async (withMic = true) => {
    try {
      stopRecording();

      const { cameraStream, micStream, hasCameraAudio } =
        await getWebcamStreams(withMic);
      const combinedStream = new MediaStream() as ExtendedMediaStream;

      // Add video tracks from camera
      cameraStream
        .getVideoTracks()
        .forEach((track: MediaStreamTrack) => combinedStream.addTrack(track));

      // Handle audio mixing if needed
      if (hasCameraAudio || micStream) {
        audioContextRef.current = new AudioContext();
        const audioDestination = createAudioMixer(
          audioContextRef.current,
          cameraStream,
          micStream,
          hasCameraAudio
        );

        audioDestination?.stream
          .getAudioTracks()
          .forEach((track: MediaStreamTrack) => combinedStream.addTrack(track));
      } else {
        // If no audio available, just add camera audio tracks directly
        cameraStream
          .getAudioTracks()
          .forEach((track: MediaStreamTrack) => combinedStream.addTrack(track));
      }

      combinedStream._originalStreams = [
        cameraStream,
        ...(micStream ? [micStream] : []),
      ];
      streamRef.current = combinedStream;

      mediaRecorderRef.current = setupRecording(combinedStream, {
        onDataAvailable: (e) => e.data.size && chunksRef.current.push(e.data),
        onStop: handleRecordingStop,
      });

      chunksRef.current = [];
      startTimeRef.current = Date.now();
      mediaRecorderRef.current.start(1000);
      setState((prev) => ({ ...prev, isRecording: true }));
      return true;
    } catch (error) {
      console.error("Webcam recording error:", error);
      return false;
    }
  };

  const stopRecording = () => {
    cleanupRecording(
      mediaRecorderRef.current,
      streamRef.current,
      streamRef.current?._originalStreams
    );
    streamRef.current = null;
    setState((prev) => ({ ...prev, isRecording: false }));
  };

  const resetRecording = () => {
    stopRecording();
    if (state.recordedVideoUrl) URL.revokeObjectURL(state.recordedVideoUrl);
    setState({
      isRecording: false,
      recordedBlob: null,
      recordedVideoUrl: "",
      recordingDuration: 0,
    });
    startTimeRef.current = null;
  };

  return {
    ...state,
    startRecording,
    stopRecording,
    resetRecording,
    currentStream: streamRef.current,
  };
}; 