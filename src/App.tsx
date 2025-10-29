import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MainLayout from './components/layout/MainLayout';
import ShopLayout from './components/layout/ShopLayout';
import AdminLayout from './components/layout/AdminLayout';
import Home from './pages/shop/Home';
import Shop from './pages/shop/Shop';
import PerfumeDetail from './pages/shop/PerfumeDetail';
import Login from './pages/Login';
import Profile from './pages/Profile';
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminBrands from './pages/admin/Brands';
import AdminPerfumes from './pages/admin/Perfumes';
import GeminiAssistant from './pages/GeminiAssistant';
import { AuthProvider } from './context/AuthContext';
import AuthLayout from './components/layout/AuthLayout';
import { Toaster } from './components/ui/toaster';

const qc = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={qc}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Shop Routes */}
            <Route element={<ShopLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/perfumes/:id" element={<PerfumeDetail />} />
            </Route>

            {/* Auth Only */}
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<Login />} />
            </Route>

            {/* User Routes */}
            <Route element={<MainLayout />}>
              <Route path="/profile" element={<Profile />} />
              <Route path="/assistant" element={<GeminiAssistant />} />
            </Route>

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="perfumes" element={<AdminPerfumes />} />
              <Route path="brands" element={<AdminBrands />} />
            </Route>
          </Routes>
        </BrowserRouter>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}


