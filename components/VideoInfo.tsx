'use client';
import { cn, parseTranscript } from '@/lib/utils';
import EmptyState from './EmptyState';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { FileText, Info } from 'lucide-react';

const VideoInfo = ({
  transcript,
  createdAt,
  description,
  videoId,
  videoUrl,
  title,
}: VideoInfoProps) => {
  const parsedTranscript = parseTranscript(transcript || '');

  const renderTranscript = () => (
    <div className="space-y-4">
      {parsedTranscript.length > 0 ? (
        <div className="space-y-3">
          {parsedTranscript.map((item, index) => (
            <div key={index} className="border-l-2 border-muted pl-4 py-2">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="outline" className="text-xs">
                  {item.time}
                </Badge>
              </div>
              <p className="text-sm leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon="/assets/icons/copy.svg"
          title="No transcript available"
          description="This video doesn't include any transcribed content!"
        />
      )}
    </div>
  );

  const metaDatas = [
    {
      label: 'Video title',
      value: `${title} - ${new Date(createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })}`,
    },
    {
      label: 'Video description',
      value: description,
    },
    {
      label: 'Video id',
      value: videoId,
    },
    {
      label: 'Video url',
      value: videoUrl,
    },
  ];

  const renderMetadata = () => (
    <div className="space-y-4">
      {metaDatas.map(({ label, value }, index) => (
        <div key={index} className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">{label}</h3>
          <p
            className={cn(
              'text-sm break-words',
              label === 'Video url' &&
                'text-primary hover:underline cursor-pointer'
            )}
            onClick={
              label === 'Video url'
                ? () => window.open(value, '_blank')
                : undefined
            }
          >
            {value}
          </p>
        </div>
      ))}
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Video Information</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="transcript" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="transcript" className="gap-2">
              <FileText className="h-4 w-4" />
              Transcript
            </TabsTrigger>
            <TabsTrigger value="metadata" className="gap-2">
              <Info className="h-4 w-4" />
              Metadata
            </TabsTrigger>
          </TabsList>

          <TabsContent value="transcript" className="mt-4">
            {renderTranscript()}
          </TabsContent>

          <TabsContent value="metadata" className="mt-4">
            {renderMetadata()}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default VideoInfo;
