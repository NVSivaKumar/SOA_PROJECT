import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/api';
import { ArrowLeft, Save, AlertCircle } from 'lucide-react';

const NewComplaint = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'TECHNICAL',
    priority: 'LOW'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.post('/complaints', formData);
      navigate('/complaints');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit complaint. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center space-x-4 mb-6">
        <Link to="/complaints" className="text-text-muted hover:text-gold-bright transition-colors">
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <h2 className="text-3xl font-serif text-text-main tracking-wide">Submit New Ticket</h2>
      </div>

      {error && (
        <div className="bg-glass-panel border-l-4 border-gold-bronze p-4 mb-4">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-gold-bronze mr-2" />
            <p className="text-sm text-text-main">{error}</p>
          </div>
        </div>
      )}

      <div className="glass-panel-lg overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-text-main mb-2">
              Issue Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              placeholder="Brief summary of the issue"
              className="w-full bg-glass-fill backdrop-blur-sm border border-glass-border text-text-main rounded-md-glass shadow-sm focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold sm:text-sm py-2.5 px-4 transition-all placeholder-text-muted"
              value={formData.title}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-text-main mb-2">
                Category
              </label>
              <select
                id="category"
                name="category"
                className="w-full bg-glass-fill backdrop-blur-sm border border-glass-border text-text-main rounded-md-glass shadow-sm focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold sm:text-sm py-2.5 px-4 transition-all appearance-none cursor-pointer font-mono"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="TECHNICAL" className="bg-background">Technical Support</option>
                <option value="BILLING" className="bg-background">Billing & Payments</option>
                <option value="ACCOUNT" className="bg-background">Account Management</option>
                <option value="NETWORK" className="bg-background">Network Issues</option>
                <option value="SECURITY" className="bg-background">Security Concern</option>
                <option value="OTHER" className="bg-background">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-text-main mb-2">
                Priority Level
              </label>
              <select
                id="priority"
                name="priority"
                className="w-full bg-glass-fill backdrop-blur-sm border border-glass-border text-text-main rounded-md-glass shadow-sm focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold sm:text-sm py-2.5 px-4 transition-all appearance-none cursor-pointer font-mono"
                value={formData.priority}
                onChange={handleChange}
              >
                <option value="LOW" className="bg-background">Low</option>
                <option value="MEDIUM" className="bg-background">Medium</option>
                <option value="HIGH" className="bg-background">High</option>
                <option value="CRITICAL" className="bg-background">Critical</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-text-main mb-2">
              Detailed Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={6}
              required
              placeholder="Please provide as much detail as possible about your issue..."
              className="w-full bg-glass-fill backdrop-blur-sm border border-glass-border text-text-main rounded-md-glass shadow-sm focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold sm:text-sm py-2.5 px-4 transition-all placeholder-text-muted"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className="pt-4 flex justify-end">
            <Link
              to="/complaints"
              className="bg-glass-fill backdrop-blur-sm py-2.5 px-5 border border-glass-border rounded-sm-glass shadow-sm text-sm font-medium text-text-muted hover:bg-glass-panel hover:text-text-main transition-all mr-3"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className={`inline-flex justify-center py-2.5 px-5 shadow-lg text-sm font-medium rounded-sm-glass text-background bg-gold-gradient hover:-translate-y-[2px] transition-transform ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                'Submitting...'
              ) : (
                <>
                  <Save className="h-5 w-5 mr-2 -ml-1 text-background/70" />
                  Submit Complaint
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewComplaint;
