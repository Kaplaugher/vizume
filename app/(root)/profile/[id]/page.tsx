import Header from '@/components/ui/header';
import VideoCard from '@/components/VideoCard';
import { getAllVideosByUser } from '@/lib/actions/video';
import { redirect } from 'next/navigation';

const Profile = async ({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { query: string; filter: string };
}) => {
  const { id } = await params;
  const { query, filter } = await searchParams;

  const { user, videos } = await getAllVideosByUser(id, query, filter);
  if (!user) redirect('/404');
  return (
    <div className="container mx-auto sm:px-6 lg:px-8">
      <Header
        subHeader={user?.email}
        title={user?.name}
        userImage={user?.image ?? ''}
      />
      <ul
        role="list"
        className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8"
      >
        {videos.map(({ video }) => (
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
    </div>
  );
};

export default Profile;
