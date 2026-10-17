import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';

const MainLayout = () => (
  <>
    <Navbar />
    <main style={{ paddingTop: '72px', minHeight: '100vh' }}>
      <Outlet />
    </main>
    <Footer />
  </>
);

export default MainLayout;
