'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Video, X, Upload } from 'lucide-react';
import { useScreenRecording } from '@/lib/hooks/useScreenRecording';

const RecordScreen = () => {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const {
    isRecording,
    recordedBlob,
    recordedVideoUrl,
    recordingDuration,
    startRecording,
    stopRecording,
    resetRecording,
  } = useScreenRecording();

  const closeModal = () => {
    resetRecording();
    setIsOpen(false);
  };

  const handleStart = async () => {
    await startRecording();
  };

  const recordAgain = async () => {
    resetRecording();
    await startRecording();
    if (recordedVideoUrl && videoRef.current)
      videoRef.current.src = recordedVideoUrl;
  };

  const goToUpload = () => {
    if (!recordedBlob) return;
    const url = URL.createObjectURL(recordedBlob);
    sessionStorage.setItem(
      'recordedVideo',
      JSON.stringify({
        url,
        name: 'screen-recording.webm',
        type: recordedBlob.type,
        size: recordedBlob.size,
        duration: recordingDuration || 0,
      })
    );
    router.push('/upload');
    closeModal();
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
          <DialogTitle>Screen Recording</DialogTitle>
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
          {/* Recording Status/Video Display */}
          <div className="flex items-center justify-center min-h-[300px] bg-muted/30 rounded-lg">
            {isRecording ? (
              <div className="text-center space-y-4">
                <div className="h-4 w-4 bg-red-500 rounded-full animate-pulse mx-auto"></div>
                <span className="text-sm text-muted-foreground">
                  Recording in progress...
                </span>
              </div>
            ) : recordedVideoUrl ? (
              <video
                ref={videoRef}
                src={recordedVideoUrl}
                controls
                className="w-full max-w-md rounded-lg"
              />
            ) : (
              <p className="text-sm text-muted-foreground text-center">
                Click record to start capturing your screen
              </p>
            )}
          </div>

          {/* Control Buttons */}
          <div className="flex justify-center gap-3">
            {!isRecording && !recordedVideoUrl && (
              <Button onClick={handleStart} className="gap-2">
                <Video className="h-4 w-4" />
                Record
              </Button>
            )}

            {isRecording && (
              <Button
                onClick={stopRecording}
                variant="destructive"
                className="gap-2"
              >
                <Video className="h-4 w-4" />
                Stop Recording
              </Button>
            )}

            {recordedVideoUrl && (
              <div className="flex gap-3">
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
