import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Mail, Lock, User, Eye, EyeOff, Chrome } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '../components/ui/use-toast';
import { useAuthStore } from '../stores/authStore';
import { loginSchema, registerSchema, type LoginFormData, type RegisterFormData } from '../validators/auth';
import { isAdmin } from '../utils/roles';

export default function Login() {
  const { loginWithGoogle } = useAuth();
  const { user, isLoading, login, register } = useAuthStore();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (err: any) {
      toast({
        title: 'Google sign in failed',
        description: err.message || 'Failed to sign in with Google',
      });
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      if (isLogin) {
        const validatedData = loginSchema.parse({ email, password });
        await login(validatedData.email, validatedData.password);
        const currentUser = useAuthStore.getState().user;
        navigate(currentUser && isAdmin(currentUser) ? '/admin' : '/');
      } else {
        const validatedData = registerSchema.parse({ name, email, password, confirmPassword });
        await register(validatedData.email, validatedData.password, validatedData.name);
        const currentUser = useAuthStore.getState().user;
        navigate(currentUser && isAdmin(currentUser) ? '/admin' : '/');
      }
    } catch (err: any) {
      if (err.name === 'ZodError') {
        const fieldErrors: Record<string, string> = {};
        err.errors.forEach((error: any) => {
          fieldErrors[error.path[0]] = error.message;
        });
        setErrors(fieldErrors);
      } else {
        const msg = err?.response?.data?.message || err?.message || `Failed to ${isLogin ? 'sign in' : 'register'}`;
        toast({
          title: isLogin ? 'Sign in failed' : 'Registration failed',
          description: msg,
        });
      }
    }
  };

  return (
    <div className="h-screen w-screen grid grid-cols-1 md:grid-cols-2">
      {/* Left: Form */}
      <div className="bg-white overflow-y-auto flex flex-col">
        <div className="p-6 sm:p-10 flex-1 flex flex-col justify-center max-w-lg mx-auto w-full">
          {/* Logo/Brand */}
          <div className="mb-2">
            <Link to="/" aria-label="Go to home" className="inline-flex items-center gap-2">
              <img src="/images/logo.svg" alt="Perfumery" className="w-full h-12" />
            </Link>
          </div>

          <Card className="shadow-none border-0 p-0">
          <CardHeader className="p-0 pb-6">
            <CardTitle className="text-left text-xl font-semibold">
              {isLogin ? 'Sign in to your account' : 'Create your account'}
            </CardTitle>
          </CardHeader>

          <CardContent className="p-0">

            {/* Email/Password Form */}
            <form onSubmit={handleEmailAuth} className="space-y-5">
              {!isLogin && (
              <div>
                <Label htmlFor="name" className="text-sm font-medium text-gray-700 mb-1 block">Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`h-11 ${errors.name ? 'border-red-500' : ''}`}
                  required={!isLogin}
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>
              )}

              <div>
                <Label htmlFor="email" className="text-sm font-medium text-gray-700 mb-1 block">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`h-11 ${errors.email ? 'border-red-500' : ''}`}
                  required
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              <div>
                <Label htmlFor="password" className="text-sm font-medium text-gray-700 mb-1 block">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`h-11 pr-10 ${errors.password ? 'border-red-500' : ''}`}
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                {!isLogin && !errors.password && (
                  <p className="mt-1 text-xs text-gray-500">Minimum 6 characters</p>
                )}
              </div>

              {!isLogin && (
                <div>
                  <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700 mb-1 block">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Re-enter your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`h-11 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                    required
                    minLength={6}
                  />
                  {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                </div>
              )}

              {!isLogin && (
                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    id="terms"
                    className="mt-1 w-4 h-4 text-rose-600 border-gray-300 rounded focus:ring-rose-500"
                  />
                  <label htmlFor="terms" className="text-sm text-gray-600">
                    I agree to the{' '}
                    <a href="#" className="underline text-gray-900 hover:text-rose-600">
                      terms & policy
                    </a>
                  </label>
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className={`w-full h-11 ${!isLogin ? 'bg-green-600 hover:bg-green-700' : 'bg-rose-600 hover:bg-rose-700'}`}
              >
                {isLoading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Signup')}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or</span>
              </div>
            </div>

            {/* Social Sign In */}
            <div className="space-y-3">
              <Button
                type="button"
                variant="outline"
                className="w-full justify-start bg-white border-gray-300 hover:bg-gray-50"
                onClick={handleGoogleLogin}
              >
                <Chrome className="w-4 h-4 mr-2" />
                Sign in with Google
              </Button>
            </div>

            {/* Toggle Login/Register */}
            <div className="mt-6 text-center text-sm">
              <span className="text-gray-600">
                {isLogin ? "Don't have an account?" : 'Have an account?'}
              </span>
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setErrors({});
                }}
                className="ml-2 text-rose-600 hover:text-rose-700 font-medium"
              >
                {isLogin ? 'Sign up' : 'Sign In'}
              </button>
            </div>
          </CardContent>
          </Card>
        </div>
      </div>

      {/* Right: Banner */}
      <div className="hidden md:block bg-rose-100 h-full">
        <img
          src="/images/banner-login.jpg"
          alt="Login banner"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}
