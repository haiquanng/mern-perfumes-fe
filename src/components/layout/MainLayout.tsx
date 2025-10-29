import { Outlet, useLocation } from 'react-router-dom';
import Header from '../element/Header';
import Footer from '../element/Footer';

export default function MainLayout() {
  const location = useLocation();
  const hideFooter = location.pathname === '/assistant';

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      {!hideFooter && <Footer />}
    </div>
  );
}
