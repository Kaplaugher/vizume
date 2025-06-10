import Navbar from '@/components/ui/navbar';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <Navbar />
      <div className="container mx-auto sm:px-6 lg:px-8">{children}</div>
    </div>
  );
};

export default Layout;
