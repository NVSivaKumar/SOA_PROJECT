import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth, ThemeToggle } from '../context/AuthContext';
import { 
  Home, 
  FileText, 
  PlusCircle, 
  LogOut, 
  Bell, 
  Menu, 
  X,
  User,
  CheckCircle,
  Briefcase
} from 'lucide-react';
import api from '../api/api';
import BackendStatusBanner from './BackendStatusBanner';

const Layout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    fetchUnreadNotifications();
    const interval = setInterval(fetchUnreadNotifications, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, []);

  const fetchUnreadNotifications = async () => {
    try {
      const response = await api.get('/notifications/unread');
      setNotifications(response.data);
      setUnreadNotifications(response.data.length);
    } catch (error) {
      console.error('Failed to fetch notifications', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setUnreadNotifications(0);
      setNotifications([]);
      setShowNotifications(false);
    } catch (error) {
      console.error('Failed to mark notifications as read', error);
    }
  };

  const markAsRead = async (id: number) => {
    try {
      await api.put(`/notifications/${id}/read`);
      fetchUnreadNotifications();
    } catch (error) {
      console.error('Failed to mark notification as read', error);
    }
  };

  const getNavLinks = () => {
    if (user?.role === 'CUSTOMER') {
      return [
        { name: 'Dashboard', path: '/dashboard', icon: Home },
        { name: 'My Complaints', path: '/complaints', icon: FileText },
        { name: 'New Complaint', path: '/complaints/new', icon: PlusCircle },
      ];
    } else if (user?.role === 'AGENT') {
      return [
        { name: 'Dashboard', path: '/agent/dashboard', icon: Home },
        { name: 'My Tickets', path: '/agent/tickets', icon: Briefcase },
      ];
    } else {
      return [
        { name: 'Dashboard', path: '/admin/dashboard', icon: Home },
        { name: 'All Complaints', path: '/admin/complaints', icon: FileText },
      ];
    }
  };

  return (
    <div className="flex h-screen font-sans text-text-main">
      {/* Cinematic Background Elements */}

      {/* Mobile sidebar toggle */}
      <div className="md:hidden fixed top-0 left-0 w-full glass-panel border-b-0 rounded-none p-4 flex justify-between items-center z-20 shadow-md">
        <span className="text-xl font-serif font-bold text-gold">ResolveNow</span>
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <button className="relative" onClick={() => setShowNotifications(!showNotifications)}>
            <Bell size={24} className="text-text-main hover:text-gold transition-colors" />
            {unreadNotifications > 0 && (
              <span className="absolute -top-1 -right-1 bg-gold-bright text-background font-mono rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {unreadNotifications}
              </span>
            )}
          </button>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-text-main hover:text-gold transition-colors">
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Sidebar - Floating & Detached */}
      <div className="p-4 md:py-6 md:pl-6 z-10 flex h-full">
        <div className={`fixed inset-y-4 left-4 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-[120%]'} md:relative md:translate-x-0 w-64 glass-panel rounded-lg-glass flex flex-col transition-transform duration-500 ease-in-out`}>
          <div className="h-20 flex items-center px-6 border-b border-glass-border hidden md:flex text-gold">
            <span className="text-2xl font-serif font-semibold tracking-wide flex items-center space-x-3">
              <CheckCircle className="h-6 w-6 text-gold-bright" />
              <span>ResolveNow</span>
            </span>
          </div>
        
        <div className="flex-1 overflow-y-auto py-4 pt-20 md:pt-4">
          <nav className="space-y-2 px-3">
            {getNavLinks().map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`${
                    isActive
                      ? 'bg-glass-panel text-gold-bright border-l-2 border-gold-bright rounded-r-md-glass'
                      : 'text-text-muted hover:bg-glass-panel hover:text-text-main border-l-2 border-transparent rounded-r-md-glass'
                  } group flex items-center px-4 py-3 text-sm font-medium transition-all duration-300`}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <Icon
                    className={`${
                      isActive ? 'text-gold-bright' : 'text-text-muted group-hover:text-text-main'
                    } mr-4 flex-shrink-0 h-5 w-5 transition-colors`}
                  />
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex-shrink-0 flex border-t border-glass-border p-4">
          <div className="flex-shrink-0 w-full group block">
            <div className="flex items-center">
              <div>
                <div className="h-10 w-10 rounded-full bg-gold-gradient text-background flex items-center justify-center shadow-lg">
                  <User size={20} />
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-text-main transition-colors">
                  {user?.name}
                </p>
                <p className="text-xs font-medium text-text-muted font-mono transition-colors">
                  {user?.role}
                </p>
              </div>
              <button 
                onClick={logout}
                className="ml-auto text-text-muted hover:text-gold-bronze transition-colors"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden bg-transparent">
        <BackendStatusBanner />
        {/* Top Header for Desktop (Actions only) */}
        <header className="absolute top-0 right-0 h-20 hidden md:flex items-center justify-end px-10 z-50 pointer-events-none">
          <div className="relative flex items-center space-x-6 pointer-events-auto">
            <ThemeToggle />
            <button 
              className="text-text-muted hover:text-gold transition-colors relative p-2"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell size={24} />
              {unreadNotifications > 0 && (
                <span className="absolute top-1 right-1 bg-gold-bright text-background rounded-full w-5 h-5 flex items-center justify-center text-xs font-mono">
                  {unreadNotifications}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 glass-panel rounded-lg-glass shadow-xl overflow-hidden z-20">
                <div className="px-4 py-3 border-b border-glass-border flex justify-between items-center bg-glass-fill backdrop-blur-sm">
                  <h3 className="text-sm font-serif font-medium text-text-main">Notifications</h3>
                  {unreadNotifications > 0 && (
                    <button 
                      onClick={markAllAsRead}
                      className="text-xs text-text-muted hover:text-gold-bright transition-colors"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="px-4 py-6 text-sm text-center text-text-muted">
                      No new notifications
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <div 
                        key={notification.id} 
                        className="px-4 py-3 border-b border-glass-border hover:bg-glass-panel cursor-pointer transition-colors"
                        onClick={() => markAsRead(notification.id)}
                      >
                        <p className="text-sm font-medium text-text-main">{notification.title}</p>
                        <p className="text-sm text-text-muted mt-1">{notification.message}</p>
                        <p className="text-xs text-text-muted/70 font-mono mt-1">
                          {new Date(notification.createdAt).toLocaleString()}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Main Body */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-transparent px-4 py-6 md:px-10 md:py-8 z-10 scrollbar-hide">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
