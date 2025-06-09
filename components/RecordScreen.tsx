'use client';

import { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Video, X, Upload, Monitor, Camera } from 'lucide-react';
import { useScreenRecording } from '@/lib/hooks/useScreenRecording';
import { useWebcamRecording } from '@/lib/hooks/useWebcamRecording';

type RecordingMode = 'screen' | 'webcam' | null;

const RecordScreen = () => {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const liveVideoRef = useRef<HTMLVideoElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [recordingMode, setRecordingMode] = useState<RecordingMode>(null);

  const screenRecording = useScreenRecording();
  const webcamRecording = useWebcamRecording();

  // Get the current recording state based on the selected mode
  const currentRecording =
    recordingMode === 'screen' ? screenRecording : webcamRecording;

  // Effect to handle live webcam feed
  useEffect(() => {
    if (
      recordingMode === 'webcam' &&
      webcamRecording.currentStream &&
      liveVideoRef.current
    ) {
      liveVideoRef.current.srcObject = webcamRecording.currentStream;
      liveVideoRef.current.play().catch(console.error);
    }
  }, [recordingMode, webcamRecording.currentStream]);

  const closeModal = () => {
    screenRecording.resetRecording();
    webcamRecording.resetRecording();
    // Stop preview stream if it exists
    if (liveVideoRef.current?.srcObject) {
      const stream = liveVideoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      liveVideoRef.current.srcObject = null;
    }
    setRecordingMode(null);
    setIsOpen(false);
  };

  const handleModeSelect = async (mode: RecordingMode) => {
    setRecordingMode(mode);
    // Start camera preview for webcam mode
    if (mode === 'webcam') {
      try {
        const cameraStream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1920 },
            height: { ideal: 1080 },
            frameRate: { ideal: 30 },
          },
          audio: false, // Just for preview, audio will be handled during recording
        });
        if (liveVideoRef.current) {
          liveVideoRef.current.srcObject = cameraStream;
          liveVideoRef.current.play().catch(console.error);
        }
      } catch (error) {
        console.error('Error accessing camera for preview:', error);
      }
    }
  };

  const handleStart = async () => {
    if (!currentRecording) return;
    await currentRecording.startRecording();
  };

  const recordAgain = async () => {
    if (!currentRecording) return;
    currentRecording.resetRecording();
    await currentRecording.startRecording();
    if (currentRecording.recordedVideoUrl && videoRef.current) {
      videoRef.current.src = currentRecording.recordedVideoUrl;
    }
  };

  const goToUpload = () => {
    if (!currentRecording?.recordedBlob) return;
    const url = URL.createObjectURL(currentRecording.recordedBlob);
    const recordingType =
      recordingMode === 'screen' ? 'screen-recording' : 'webcam-recording';
    sessionStorage.setItem(
      'recordedVideo',
      JSON.stringify({
        url,
        name: `${recordingType}.webm`,
        type: currentRecording.recordedBlob.type,
        size: currentRecording.recordedBlob.size,
        duration: currentRecording.recordingDuration || 0,
      })
    );
    router.push('/upload');
    closeModal();
  };

  const resetMode = () => {
    screenRecording.resetRecording();
    webcamRecording.resetRecording();
    // Stop preview stream if it exists
    if (liveVideoRef.current?.srcObject) {
      const stream = liveVideoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      liveVideoRef.current.srcObject = null;
    }
    setRecordingMode(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="default" size="sm" className="gap-2">
          <Video className="h-4 w-4" />
          Record Video
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl" showCloseButton={false}>
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <DialogTitle>
            {recordingMode === 'screen'
              ? 'Screen Recording'
              : recordingMode === 'webcam'
              ? 'Webcam Recording'
              : 'Choose Recording Type'}
          </DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={closeModal}
            className="h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </DialogHeader>

        <div className="space-y-6">
          {/* Mode Selection */}
          {!recordingMode && (
            <div className="flex flex-col gap-4">
              <p className="text-sm text-muted-foreground text-center">
                Choose what you&apos;d like to record:
              </p>
              <div className="grid grid-cols-2 gap-4">
                <Button
                  onClick={() => handleModeSelect('screen')}
                  variant="outline"
                  className="h-24 flex-col gap-2"
                >
                  <Monitor className="h-8 w-8" />
                  <span>Screen Recording</span>
                  <span className="text-xs text-muted-foreground">
                    Record your screen activity
                  </span>
                </Button>
                <Button
                  onClick={() => handleModeSelect('webcam')}
                  variant="outline"
                  className="h-24 flex-col gap-2"
                >
                  <Camera className="h-8 w-8" />
                  <span>Webcam Recording</span>
                  <span className="text-xs text-muted-foreground">
                    Record using your camera
                  </span>
                </Button>
              </div>
            </div>
          )}

          {/* Recording Status/Video Display */}
          {recordingMode && (
            <div className="flex items-center justify-center min-h-[300px] bg-muted/30 rounded-lg">
              {currentRecording?.isRecording ? (
                recordingMode === 'webcam' ? (
                  <div className="relative w-full max-w-md">
                    <video
                      ref={liveVideoRef}
                      autoPlay
                      muted
                      playsInline
                      className="w-full rounded-lg"
                    />
                    <div className="absolute top-2 right-2 flex items-center gap-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs">
                      <div className="h-2 w-2 bg-white rounded-full animate-pulse"></div>
                      REC
                    </div>
                  </div>
                ) : (
                  <div className="text-center space-y-4">
                    <div className="h-4 w-4 bg-red-500 rounded-full animate-pulse mx-auto"></div>
                    <span className="text-sm text-muted-foreground">
                      Recording screen...
                    </span>
                  </div>
                )
              ) : currentRecording?.recordedVideoUrl ? (
                <video
                  ref={videoRef}
                  src={currentRecording.recordedVideoUrl}
                  controls
                  className="w-full max-w-md rounded-lg"
                />
              ) : recordingMode === 'webcam' &&
                liveVideoRef.current?.srcObject ? (
                <div className="w-full max-w-md">
                  <video
                    ref={liveVideoRef}
                    autoPlay
                    muted
                    playsInline
                    className="w-full rounded-lg"
                  />
                  <p className="text-xs text-muted-foreground text-center mt-2">
                    Preview - Click record to start capturing
                  </p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center">
                  Click record to start capturing{' '}
                  {recordingMode === 'screen'
                    ? 'your screen'
                    : 'from your webcam'}
                </p>
              )}
            </div>
          )}

          {/* Control Buttons */}
          <div className="flex justify-center gap-3">
            {recordingMode &&
              !currentRecording?.isRecording &&
              !currentRecording?.recordedVideoUrl && (
                <>
                  <Button onClick={resetMode} variant="outline">
                    Back
                  </Button>
                  <Button onClick={handleStart} className="gap-2">
                    <Video className="h-4 w-4" />
                    Start Recording
                  </Button>
                </>
              )}

            {currentRecording?.isRecording && (
              <Button
                onClick={currentRecording.stopRecording}
                variant="destructive"
                className="gap-2"
              >
                <Video className="h-4 w-4" />
                Stop Recording
              </Button>
            )}

            {currentRecording?.recordedVideoUrl && (
              <div className="flex gap-3">
                <Button onClick={resetMode} variant="ghost">
                  Back
                </Button>
                <Button onClick={recordAgain} variant="outline">
                  Record Again
                </Button>
                <Button onClick={goToUpload} className="gap-2">
                  <Upload className="h-4 w-4" />
                  Continue to Upload
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RecordScreen;
