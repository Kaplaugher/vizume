'use client';
import { cn, parseTranscript } from '@/lib/utils';
import EmptyState from './EmptyState';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import {
  FileText,
  FileTextIcon,
  Info,
  Download,
  File,
  ExternalLink,
} from 'lucide-react';
import { useState } from 'react';

const VideoInfo = ({
  transcript,
  createdAt,
  description,
  videoId,
  videoUrl,
  title,
  resumeUrl,
}: VideoInfoProps) => {
  const parsedTranscript = parseTranscript(transcript || '');
  console.log(resumeUrl);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const renderResume = () => (
    <div className="space-y-4">
      {resumeUrl ? (
        <div className="flex flex-col items-center space-y-4 p-6 border-2 border-dashed border-muted rounded-lg">
          <File className="h-16 w-16 text-muted-foreground" />
          <div className="text-center space-y-4">
            <div>
              <h3 className="text-lg font-medium">Resume Available</h3>
              <p className="text-sm text-muted-foreground">
                View the attached PDF resume
              </p>
            </div>
            <div className="flex gap-2">
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <File className="h-4 w-4" />
                    View Resume
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
                  <DialogHeader>
                    <DialogTitle className="flex items-center justify-between">
                      Resume
                      <div className="flex gap-2">
                        <Button
                          onClick={() => window.open(resumeUrl, '_blank')}
                          variant="outline"
                          size="sm"
                          className="gap-2"
                        >
                          <ExternalLink className="h-4 w-4" />
                          Open in New Tab
                        </Button>
                        <Button
                          onClick={() => window.open(resumeUrl, '_blank')}
                          variant="outline"
                          size="sm"
                          className="gap-2"
                        >
                          <Download className="h-4 w-4" />
                          Download
                        </Button>
                      </div>
                    </DialogTitle>
                  </DialogHeader>
                  <div className="flex-1 border rounded-lg overflow-hidden">
                    <iframe
                      src={`${resumeUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                      className="w-full h-full border-0"
                      title="Resume PDF"
                      loading="lazy"
                    />
                  </div>
                </DialogContent>
              </Dialog>
              <Button
                onClick={() => window.open(resumeUrl, '_blank')}
                variant="outline"
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                Download
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <EmptyState
          icon={<File className="h-12 w-12" />}
          title="No resume available"
          description="This video doesn't include a resume attachment."
        />
      )}
    </div>
  );

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
          icon={<FileTextIcon className="h-12 w-12" />}
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
        <Tabs defaultValue="resume" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="resume" className="gap-2">
              <File className="h-4 w-4" />
              Resume
            </TabsTrigger>
            <TabsTrigger value="transcript" className="gap-2">
              <FileText className="h-4 w-4" />
              Transcript
            </TabsTrigger>
            <TabsTrigger value="metadata" className="gap-2">
              <Info className="h-4 w-4" />
              Metadata
            </TabsTrigger>
          </TabsList>

          <TabsContent value="resume" className="mt-4">
            {renderResume()}
          </TabsContent>

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
