import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Coins, User, LogOut, LayoutDashboard, Github, Menu, X } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent",
        isScrolled ? "glass-panel py-2" : "bg-transparent py-4"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-glow group-hover:scale-110 transition-transform duration-300">
              <Coins className="w-6 h-6 text-white animate-pulse-slow" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-xl tracking-tight text-foreground group-hover:text-primary transition-colors">
                MicroTask
              </span>
              <span className="text-[10px] text-muted-foreground font-medium tracking-widest uppercase">
                Earn & Grow
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className={cn(
                "text-sm font-medium transition-all hover:text-primary relative group",
                location.pathname === '/' ? "text-primary" : "text-muted-foreground"
              )}
            >
              Home
              <span className={cn(
                "absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full",
                location.pathname === '/' ? "w-full" : ""
              )} />
            </Link>

            {user ? (
              <>
                <Link to="/dashboard">
                  <Button variant="ghost" className="gap-2 hover:bg-primary/10 hover:text-primary transition-colors">
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Button>
                </Link>

                <div className="coin-badge">
                  <Coins className="w-4 h-4" />
                  <span>{user.coins}</span>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-9 w-9 rounded-full overflow-hidden border-2 border-primary/20 hover:border-primary transition-colors p-0">
                      <Avatar className="h-full w-full">
                        <AvatarImage src={user.photoUrl} alt={user.name} />
                        <AvatarFallback className="bg-primary/10 text-primary font-bold">
                          {user.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 p-2 backdrop-blur-xl bg-card/90 border-primary/20 shadow-xl">
                    <div className="flex items-center gap-2 p-2 mb-2 rounded-lg bg-primary/5">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.photoUrl} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold">{user.name}</span>
                        <span className="text-xs text-muted-foreground capitalize">{user.role}</span>
                      </div>
                    </div>
                    <DropdownMenuItem className="cursor-pointer gap-2 focus:bg-primary/10 focus:text-primary" asChild>
                      <Link to="/dashboard/profile">
                        <User className="w-4 h-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-primary/10" />
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer gap-2 text-destructive focus:bg-destructive/10">
                      <LogOut className="w-4 h-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login">
                  <Button variant="ghost" className="hover:bg-primary/10 hover:text-primary transition-colors">Sign In</Button>
                </Link>
                <Link to="/register">
                  <Button className="gradient-primary shadow-glow hover:shadow-glow/150 hover:scale-105 transition-all duration-300 border-0">
                    Join Now
                  </Button>
                </Link>
                <a
                  href="https://github.com/shahamir01"
                  target="_blank"
                  rel="noreferrer"
                  className="ml-2 p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                >
                  <Github className="w-5 h-5" />
                </a>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-foreground hover:text-primary transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-primary/10 animate-slide-up bg-background/95 backdrop-blur-xl absolute left-0 right-0 shadow-xl px-4">
            <div className="flex flex-col gap-3">
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start">Home</Button>
              </Link>
              {user ? (
                <>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-primary/5 border border-primary/10">
                    <Avatar className="w-10 h-10 border-2 border-primary/20">
                      <AvatarImage src={user.photoUrl} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-sm">{user.name}</p>
                      <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
                    </div>
                    <div className="coin-badge ml-auto text-xs">
                      <Coins className="w-3 h-3" />
                      <span>{user.coins}</span>
                    </div>
                  </div>
                  <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start gap-2 hover:bg-primary/10 hover:text-primary">
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-2 text-destructive hover:bg-destructive/10"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start hover:bg-primary/10 hover:text-primary">Login</Button>
                  </Link>
                  <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button className="w-full gradient-primary shadow-glow border-0">Register</Button>
                  </Link>
                </>
              )}
              <a
                href="https://github.com/shahamir01"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" className="w-full gap-2 border-primary/20 hover:border-primary/50">
                  <Github className="w-4 h-4" />
                  Join as Developer
                </Button>
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
