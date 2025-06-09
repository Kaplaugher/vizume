'use client';

import { cn, createIframeLink } from '@/lib/utils';
import { useEffect, useRef, useState } from 'react';
import {
  incrementVideoViews,
  getVideoProcessingStatus,
} from '@/lib/actions/video';
import { initialVideoState } from '@/lib/constants';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

const VideoPlayer = ({ videoId, className }: VideoPlayerProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [state, setState] = useState(initialVideoState);

  useEffect(() => {
    const checkProcessingStatus = async () => {
      const status = await getVideoProcessingStatus(videoId);
      setState((prev) => ({
        ...prev,
        isProcessing: !status.isProcessed,
      }));

      return status.isProcessed;
    };

    checkProcessingStatus();

    const intervalId = setInterval(async () => {
      const isProcessed = await checkProcessingStatus();
      if (isProcessed) {
        clearInterval(intervalId);
      }
    }, 3000);
    return () => {
      clearInterval(intervalId);
    };
  }, [videoId]);

  useEffect(() => {
    if (state.isLoaded && !state.hasIncrementedView && !state.isProcessing) {
      const incrementView = async () => {
        try {
          await incrementVideoViews(videoId);
          setState((prev) => ({ ...prev, hasIncrementedView: true }));
        } catch (error) {
          console.error('Failed to increment view count:', error);
        }
      };

      incrementView();
    }
  }, [videoId, state.isLoaded, state.hasIncrementedView, state.isProcessing]);

  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardContent className="p-0">
        {state.isProcessing ? (
          <div className="flex items-center justify-center min-h-[400px] bg-muted/30">
            <div className="text-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
              <p className="text-muted-foreground">Processing video...</p>
            </div>
          </div>
        ) : (
          <div className="relative w-full aspect-video">
            <iframe
              ref={iframeRef}
              src={createIframeLink(videoId)}
              loading="lazy"
              title="Video player"
              className="absolute inset-0 w-full h-full border-0"
              allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
              onLoad={() => setState((prev) => ({ ...prev, isLoaded: true }))}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VideoPlayer;
