import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MainLayout from './components/layout/MainLayout';
import ShopLayout from './components/layout/ShopLayout';
import AdminLayout from './components/layout/AdminLayout';
import Home from './pages/shop/Home';
import PerfumeDetail from './pages/shop/PerfumeDetail';
import Login from './pages/Login';
import Profile from './pages/Profile';
import AdminDashboard from './pages/admin/Dashboard';
import GeminiAssistant from './pages/GeminiAssistant';
import { AuthProvider } from './context/AuthContext';

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
              <Route path="/perfumes/:id" element={<PerfumeDetail />} />
            </Route>

            {/* Auth & User Routes */}
            <Route element={<MainLayout />}>
              <Route path="/login" element={<Login />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/assistant" element={<GeminiAssistant />} />
            </Route>

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}


