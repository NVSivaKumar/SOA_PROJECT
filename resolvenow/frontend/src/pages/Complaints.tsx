import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/api';
import { format } from 'date-fns';
import { Search, Filter, Plus, ChevronRight } from 'lucide-react';

const Complaints = ({ role = 'CUSTOMER' }: { role?: string }) => {
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      // Logic for fetching is handled by backend based on role headers
      const response = await api.get('/complaints');
      setComplaints(response.data);
    } catch (error) {
      console.error('Failed to fetch complaints', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredComplaints = complaints.filter(c => {
    const matchesSearch = c.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end space-y-4 sm:space-y-0">
        <div>
          <h4 className="text-xs font-bold text-gold tracking-widest uppercase mb-2 font-mono">Support Operations</h4>
          <h2 className="text-4xl md:text-5xl font-serif text-text-main tracking-wide">
            {role === 'CUSTOMER' ? 'My Complaints' : role === 'AGENT' ? 'My Tickets' : 'All Complaints'}
          </h2>
          <p className="text-text-muted mt-2 text-sm max-w-lg">Track, review, and manage the issues currently assigned to you or your department.</p>
        </div>
        {role === 'CUSTOMER' && (
          <Link
            to="/complaints/new"
            className="inline-flex items-center px-6 py-2.5 bg-gold-gradient text-background rounded-sm-glass hover:-translate-y-[2px] transition-transform shadow-lg border-none text-sm font-medium"
          >
            <Plus className="-ml-1 mr-2 h-4 w-4" aria-hidden="true" />
            New Ticket
          </Link>
        )}
      </div>

      <div className="glass-panel p-3 rounded-lg-glass flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 border-glass-border">
        <div className="flex-1 relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-text-muted group-focus-within:text-gold transition-colors" />
          </div>
          <input
            type="text"
            className="block w-full pl-11 pr-4 py-2.5 border border-glass-border rounded-md-glass leading-5 bg-glass-fill backdrop-blur-sm text-text-main placeholder-text-muted focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold sm:text-sm font-mono transition-all"
            placeholder="Search tickets by ID, issue, category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full md:w-64 relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Filter className="h-4 w-4 text-text-muted group-focus-within:text-gold transition-colors" />
          </div>
          <select
            className="block w-full pl-11 pr-10 py-2.5 text-sm border border-glass-border bg-glass-fill backdrop-blur-sm text-text-main focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold rounded-md-glass appearance-none transition-all cursor-pointer font-mono"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL" className="bg-background text-text-main">All Statuses</option>
            <option value="OPEN" className="bg-background text-text-main">Open</option>
            <option value="ASSIGNED" className="bg-background text-text-main">Assigned</option>
            <option value="IN_PROGRESS" className="bg-background text-text-main">In Progress</option>
            <option value="ESCALATED" className="bg-background text-text-main">Escalated</option>
            <option value="RESOLVED" className="bg-background text-text-main">Resolved</option>
            <option value="CLOSED" className="bg-background text-text-main">Closed</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div></div>
      ) : (
        <div className="glass-panel overflow-hidden rounded-lg-glass shadow-lg">
          <ul className="divide-y divide-glass-border">
            {filteredComplaints.length === 0 ? (
              <li className="px-6 py-12 text-center text-text-muted">
                No complaints found matching your criteria.
              </li>
            ) : (
              filteredComplaints.map((complaint) => (
                <li key={complaint.id}>
                  <Link to={`/complaints/${complaint.id}`} className="block hover:bg-background/40 transition-all duration-300 group">
                    <div className="px-6 py-5 flex items-center">
                      <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                        <div className="truncate w-1/3">
                          <div className="flex text-sm">
                            <p className="font-semibold text-gold-bright truncate font-mono">{complaint.ticketNumber}</p>
                          </div>
                          <div className="mt-1 flex">
                            <div className="flex items-center text-[15px] text-text-main font-medium truncate group-hover:text-gold-bright transition-colors">
                              {complaint.title}
                            </div>
                          </div>
                          {role !== 'CUSTOMER' && (
                            <div className="mt-1 flex text-xs text-text-muted/70 font-mono">
                              By: <span className="ml-1 text-text-muted">{complaint.customerName}</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="hidden sm:block w-1/4">
                           <div className="text-sm text-text-muted font-mono flex items-center">
                             <span className="inline-block w-2 h-2 rounded-full bg-gold mr-2"></span>
                             {complaint.category}
                           </div>
                        </div>

                        <div className="mt-4 flex-shrink-0 sm:mt-0 sm:ml-5 w-1/4">
                          <div className="flex space-x-3">
                            {getPriorityBadge(complaint.priority)}
                            {getStatusBadge(complaint.status)}
                          </div>
                        </div>

                        <div className="hidden sm:block text-sm text-text-muted font-mono w-1/6 text-right">
                          <time dateTime={complaint.createdAt}>{format(new Date(complaint.createdAt), 'MMM d, yyyy')}</time>
                        </div>
                      </div>
                      <div className="ml-5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1 duration-300">
                        <ChevronRight className="h-5 w-5 text-gold-bright" aria-hidden="true" />
                      </div>
                    </div>
                  </Link>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Complaints;
