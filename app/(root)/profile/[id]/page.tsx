import Header from '@/components/ui/header';
import VideoCard from '@/components/video-card';

const Profile = async ({ params }: { params: { id: string } }) => {
  const { id } = await params;
  return (
    <div className="container mx-auto sm:px-6 lg:px-8">
      <Header
        subHeader={`Profile ${id}`}
        title={`Profile ${id}`}
        userImage="https://github.com/shadcn.png"
      />
      <ul
        role="list"
        className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8"
      >
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((file) => (
          <VideoCard
            key={file}
            id={file.toString()}
            title={`Video ${file}`}
            thumbnail={`https://picsum.photos/200/300?random=${file}`}
            createdAt={`${file} days ago`}
            userImage={`https://picsum.photos/200/300?random=${file}`}
            views={file}
            visibility="public"
            duration="120"
          />
        ))}
      </ul>
    </div>
  );
};

export default Profile;
