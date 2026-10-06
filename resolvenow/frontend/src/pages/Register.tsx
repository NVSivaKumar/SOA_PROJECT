import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ThemeToggle } from '../context/AuthContext';
import api from '../api/api';
import { UserPlus, AlertCircle, CheckCircle } from 'lucide-react';
import BackendStatusBanner from '../components/BackendStatusBanner';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'CUSTOMER'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.post('/auth/register', formData);
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to register. Please try again.');
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
        <div className="max-w-md w-full space-y-8 glass-panel p-10 rounded-lg-glass border-glass-border">
          <div>
            <div className="flex justify-center">
              <CheckCircle className="h-12 w-12 text-gold-bright" />
            </div>
            <h2 className="mt-6 text-center text-3xl font-serif text-text-main tracking-wide">
              Create an account
            </h2>
            <p className="mt-2 text-center text-sm text-text-muted">
              Join ResolveNow to manage your service requests
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
                <label htmlFor="name" className="block text-sm font-medium text-text-main">Full Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="mt-1 appearance-none rounded-md-glass relative block w-full px-4 py-2.5 bg-glass-fill backdrop-blur-sm border border-glass-border placeholder-text-muted text-text-main focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold sm:text-sm transition-all"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-text-main">Email Address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="mt-1 appearance-none rounded-md-glass relative block w-full px-4 py-2.5 bg-glass-fill backdrop-blur-sm border border-glass-border placeholder-text-muted text-text-main focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold sm:text-sm font-mono transition-all"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-text-main">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="mt-1 appearance-none rounded-md-glass relative block w-full px-4 py-2.5 bg-glass-fill backdrop-blur-sm border border-glass-border placeholder-text-muted text-text-main focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold sm:text-sm transition-all"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-text-main">Role</label>
                <select
                  id="role"
                  name="role"
                  className="mt-1 appearance-none rounded-md-glass relative block w-full px-4 py-2.5 bg-glass-fill backdrop-blur-sm border border-glass-border text-text-main focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold sm:text-sm transition-all cursor-pointer font-mono"
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option value="CUSTOMER" className="bg-background">Customer</option>
                  <option value="AGENT" className="bg-background">Support Agent</option>
                  <option value="ADMIN" className="bg-background">Administrator</option>
                </select>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className={`group relative w-full flex justify-center py-2.5 px-4 shadow-lg text-sm font-medium rounded-sm-glass text-background bg-gold-gradient hover:-translate-y-[2px] transition-transform ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-4">
                  <UserPlus className="h-5 w-5 text-background/70 group-hover:text-background transition-colors" aria-hidden="true" />
                </span>
                {loading ? 'Registering...' : 'Register'}
              </button>
            </div>
          </form>
          
          <div className="text-center mt-4">
            <p className="text-sm text-text-muted">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-gold-bright hover:text-gold transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
