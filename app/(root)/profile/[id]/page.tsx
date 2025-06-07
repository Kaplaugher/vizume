import Header from '@/components/ui/header';

const Profile = async ({ params }: { params: { id: string } }) => {
  const { id } = await params;
  return (
    <div>
      <Header
        subHeader={`Profile ${id}`}
        title={`Profile ${id}`}
        userImage="https://github.com/shadcn.png"
      />
    </div>
  );
};

export default Profile;
