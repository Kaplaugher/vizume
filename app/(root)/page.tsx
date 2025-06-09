import EmptyState from '@/components/EmptyState';
import Header from '@/components/ui/header';
import VideoCard from '@/components/VideoCard';
import PaginationControls from '@/components/PaginationControls';
import { getAllVideos } from '@/lib/actions/video';
import { Video } from 'lucide-react';
import React from 'react';

const Home = async ({
  searchParams,
}: {
  searchParams: { page: string | number; query: string; filter: string };
}) => {
  const { page, query, filter } = await searchParams;
  const { videos, pagination } = await getAllVideos(
    query || '',
    filter,
    Number(page) || 1
  );
  console.log(videos);
  return (
    <div className="container mx-auto sm:px-6 lg:px-8">
      <Header subHeader="Library" title="All Videos" />
      <div className="container mx-auto sm:px-6 lg:px-8">
        {videos?.length > 0 ? (
          <>
            <ul
              role="list"
              className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8"
            >
              {videos.map(({ video, user }) => (
                <VideoCard
                  key={video.id}
                  id={video.videoId}
                  title={video.title}
                  thumbnail={video.thumbnailUrl}
                  createdAt={video.createdAt.toISOString()}
                  userImage={user?.image ?? ''}
                  views={video.views}
                  visibility={video.visibility}
                  duration={video.duration?.toString()}
                />
              ))}
            </ul>
            <PaginationControls
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              query={query}
              filter={filter}
            />
          </>
        ) : (
          <EmptyState
            icon={<Video className="size-10" />}
            title="No videos found"
            description="No videos found"
          />
        )}
      </div>
    </div>
  );
};

export default Home;
