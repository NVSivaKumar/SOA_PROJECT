import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';
import { format } from 'date-fns';
import { ArrowLeft, Clock, User, Tag, AlertCircle } from 'lucide-react';

const ComplaintDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [complaint, setComplaint] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComplaint();
  }, [id]);

  const fetchComplaint = async () => {
    try {
      const response = await api.get(`/complaints/${id}`);
      setComplaint(response.data);
    } catch (error) {
      console.error('Failed to fetch complaint details', error);
      navigate('/dashboard'); // Go back if not found or no access
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async () => {
    try {
      const response = await api.patch(`/complaints/${id}/resolve`);
      setComplaint(response.data);
    } catch (error) {
      console.error('Failed to resolve complaint', error);
      alert('Failed to resolve complaint. Please try again.');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this ticket? This action cannot be undone.')) {
      try {
        await api.delete(`/complaints/${id}`);
        navigate('/dashboard');
      } catch (error) {
        console.error('Failed to delete complaint', error);
        alert('Failed to delete complaint. Please try again.');
      }
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: any = {
      OPEN: 'bg-background text-gold border border-gold',
      ASSIGNED: 'bg-background text-gold-bronze border border-gold-bronze',
      IN_PROGRESS: 'bg-background text-gold-bright border border-gold-bright',
      ESCALATED: 'bg-glass-panel text-gold-bright border border-gold-bright',
      RESOLVED: 'bg-background text-gold border border-gold',
      CLOSED: 'bg-background text-text-muted border border-glass-border'
    };
    return (
      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full tracking-wide ${styles[status] || 'bg-background text-text-muted border border-glass-border'}`}>
        {status.replace('_', ' ')}
      </span>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const styles: any = {
      LOW: 'text-text-muted',
      MEDIUM: 'text-gold-bronze',
      HIGH: 'text-gold',
      CRITICAL: 'text-gold-bright'
    };
    return (
      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border border-glass-border bg-glass-fill backdrop-blur-sm font-mono ${styles[priority] || 'text-text-muted'}`}>
        {priority}
      </span>
    );
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div></div>;
  }

  if (!complaint) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => navigate(-1)} 
            className="text-text-muted hover:text-gold transition-colors"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <div>
            <h2 className="text-3xl font-serif text-text-main tracking-wide flex items-center space-x-3">
              <span>{complaint.ticketNumber}</span>
              {getStatusBadge(complaint.status)}
            </h2>
            <p className="text-sm text-text-muted mt-1 font-mono">Created on {format(new Date(complaint.createdAt), 'MMMM d, yyyy h:mm a')}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {(user?.role === 'AGENT' || user?.role === 'ADMIN') && complaint.status !== 'RESOLVED' && complaint.status !== 'CLOSED' && (
            <button 
              onClick={handleResolve}
              className="px-5 py-2.5 bg-gold-gradient text-background rounded-sm-glass hover:-translate-y-[2px] transition-transform shadow-lg border-none text-sm font-medium"
            >
              Resolve Ticket
            </button>
          )}
          
          {user?.role === 'ADMIN' && (
            <button 
              onClick={handleDelete}
              className="px-5 py-2.5 bg-glass-fill backdrop-blur-sm border border-gold-bronze text-gold-bronze rounded-sm-glass hover:bg-glass-panel shadow-sm transition-all text-sm font-medium"
            >
              Delete Ticket
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          <div className="glass-panel-lg overflow-hidden">
            <div className="px-6 py-6 border-b border-glass-border bg-background/30">
              <h3 className="text-xl font-serif text-text-main tracking-wide">{complaint.title}</h3>
            </div>
            <div className="px-6 py-6">
              <div className="prose max-w-none text-text-main whitespace-pre-wrap">
                {complaint.description}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="glass-panel-lg p-6 space-y-5">
            <h3 className="font-serif text-lg text-text-main border-b border-glass-border pb-3">Ticket Information</h3>
            
            <div className="flex items-start space-x-3 text-sm">
              <Tag className="w-5 h-5 text-gold mt-0.5" />
              <div>
                <p className="text-text-muted font-mono">Category</p>
                <p className="font-medium text-text-main">{complaint.category}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 text-sm">
              <AlertCircle className="w-5 h-5 text-gold mt-0.5" />
              <div>
                <p className="text-text-muted font-mono">Priority</p>
                <div className="mt-1">{getPriorityBadge(complaint.priority)}</div>
              </div>
            </div>

            {user?.role !== 'CUSTOMER' && (
              <div className="flex items-start space-x-3 text-sm border-t border-glass-border pt-4">
                <User className="w-5 h-5 text-gold mt-0.5" />
                <div>
                  <p className="text-text-muted font-mono">Customer</p>
                  <p className="font-medium text-text-main">{complaint.customerName}</p>
                </div>
              </div>
            )}
            
            {complaint.assignedDepartment && (
              <div className="flex items-start space-x-3 text-sm">
                <Clock className="w-5 h-5 text-gold mt-0.5" />
                <div>
                  <p className="text-text-muted font-mono">Assigned To</p>
                  <p className="font-medium text-text-main">{complaint.assignedDepartment.replace('_', ' ')}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintDetails;
