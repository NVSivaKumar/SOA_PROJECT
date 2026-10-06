import { createContext, useContext, useState, useEffect, useId } from 'react';
import type { ReactNode } from 'react';
import { flushSync } from 'react-dom';
import { Sun, Moon } from 'lucide-react';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'CUSTOMER' | 'AGENT' | 'ADMIN';
}

interface AuthContextType {
  user: User | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (token: string, user: User) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  isTransitioning: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('theme');
    return (savedTheme as Theme) || 'dark';
  });

  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    if (isTransitioning) return;

    const nextTheme = theme === 'dark' ? 'light' : 'dark';

    const updateDOM = () => {
      const root = window.document.documentElement;
      if (nextTheme === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
      localStorage.setItem('theme', nextTheme);
      flushSync(() => {
        setTheme(nextTheme);
      });
    };

    if (!document.startViewTransition) {
      updateDOM();
      return;
    }

    setIsTransitioning(true);
    const transition = document.startViewTransition(() => {
      updateDOM();
    });

    transition.finished.finally(() => {
      setIsTransitioning(false);
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isTransitioning }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeToggle = () => {
  const { theme, toggleTheme, isTransitioning } = useTheme();
  const isDark = theme === 'dark';
  const id = useId().replace(/:/g, '');

  return (
    <>
      <style>{`
        ::view-transition-group(theme-toggle-btn-${id}),
        ::view-transition-group(theme-toggle-circle-${id}) {
          animation-duration: 1s;
          animation-timing-function: linear;
        }
      `}</style>
      <button
        type="button"
        disabled={isTransitioning}
        onClick={toggleTheme}
        style={{ viewTransitionName: `theme-toggle-btn-${id}` }}
        className={`relative flex items-center w-14 h-7 rounded-full bg-glass-panel backdrop-blur-md border border-glass-border shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)] transition-colors duration-1000 focus:outline-none ${isTransitioning ? 'cursor-not-allowed opacity-80' : 'cursor-pointer'}`}
        title="Toggle Theme"
      >
        <div 
          style={{ viewTransitionName: `theme-toggle-circle-${id}` }}
          className={`absolute w-5 h-5 rounded-full bg-white/20 border border-white/40 shadow-sm transition-transform duration-1000 ease-in-out ${isDark ? 'translate-x-8' : 'translate-x-1'}`} 
        />
        <div className="absolute inset-0 flex items-center justify-between px-1.5 w-full pointer-events-none">
          <Sun size={14} className={`transition-all duration-1000 ${!isDark ? 'text-text-main drop-shadow-[0_0_6px_rgba(0,0,0,0.6)]' : 'text-text-muted/40'}`} />
          <Moon size={14} className={`transition-all duration-1000 ${isDark ? 'text-gold drop-shadow-[0_0_8px_rgba(212,175,55,1)]' : 'text-text-muted/40'}`} />
        </div>
      </button>
    </>
  );
};
