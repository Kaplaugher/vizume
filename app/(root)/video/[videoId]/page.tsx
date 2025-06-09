import { redirect } from 'next/navigation';

import VideoDetailHeader from '@/components/VideoDetailHeader';
import VideoInfo from '@/components/VideoInfo';
import VideoPlayer from '@/components/VideoPlayer';
import { getTranscript, getVideoById } from '@/lib/actions/video';

const page = async ({ params }: Params) => {
  const { videoId } = await params;

  const { user, video } = await getVideoById(videoId);
  if (!video) redirect('/404');

  const transcript = await getTranscript(videoId);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <VideoDetailHeader
          title={video.title}
          createdAt={video.createdAt}
          userImg={user?.image}
          username={user?.name}
          videoId={video.videoId}
          ownerId={video.userId}
          visibility={video.visibility}
          thumbnailUrl={video.thumbnailUrl}
        />

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <VideoPlayer videoId={video.videoId} />
          </div>

          <div className="lg:col-span-1">
            <VideoInfo
              transcript={transcript}
              title={video.title}
              createdAt={video.createdAt}
              description={video.description}
              videoId={videoId}
              videoUrl={video.videoUrl}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
