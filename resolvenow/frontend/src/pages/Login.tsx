import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth, ThemeToggle } from '../context/AuthContext';
import api from '../api/api';
import { LogIn, AlertCircle, CheckCircle } from 'lucide-react';
import BackendStatusBanner from '../components/BackendStatusBanner';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/login', { email, password });
      login(response.data.token, response.data.user);
      
      const role = response.data.user.role;
      if (role === 'ADMIN') navigate('/admin/dashboard');
      else if (role === 'AGENT') navigate('/agent/dashboard');
      else navigate('/dashboard');
      
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to login. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-transparent font-sans text-text-main">
      <div className="absolute top-6 right-6 z-50">
        <ThemeToggle />
      </div>
      {/* Background Elements */}
      
      <BackendStatusBanner />
      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 z-10">
        <div className="max-w-md w-full space-y-8 glass-panel p-10 rounded-lg-glass">
          <div>
            <div className="flex justify-center">
              <CheckCircle className="h-12 w-12 text-gold-bright" />
            </div>
            <h2 className="mt-6 text-center text-3xl font-serif text-text-main tracking-wide">
              Sign in to your account
            </h2>
            <p className="mt-2 text-center text-sm text-text-muted">
              Welcome back to ResolveNow
            </p>
          </div>
          
          {error && (
            <div className="bg-glass-panel border-l-4 border-gold-bronze p-4 mb-4">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-gold-bronze mr-2" />
                <p className="text-sm text-text-main">{error}</p>
              </div>
            </div>
          )}

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-text-main">Email Address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="mt-1 appearance-none rounded-md-glass relative block w-full px-4 py-2.5 bg-glass-fill backdrop-blur-sm border border-glass-border placeholder-text-muted text-text-main focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold sm:text-sm font-mono transition-all"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-text-main">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="mt-1 appearance-none rounded-md-glass relative block w-full px-4 py-2.5 bg-glass-fill backdrop-blur-sm border border-glass-border placeholder-text-muted text-text-main focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold sm:text-sm transition-all"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className={`group relative w-full flex justify-center py-2.5 px-4 shadow-lg text-sm font-medium rounded-sm-glass text-background bg-gold-gradient hover:-translate-y-[2px] transition-transform ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-4">
                  <LogIn className="h-5 w-5 text-background/70 group-hover:text-background transition-colors" aria-hidden="true" />
                </span>
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>
          
          <div className="text-center mt-4">
            <p className="text-sm text-text-muted">
              Don't have an account?{' '}
              <Link to="/register" className="font-medium text-gold-bright hover:text-gold transition-colors">
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
