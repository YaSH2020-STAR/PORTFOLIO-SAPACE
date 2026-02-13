import React, { useState } from 'react';
import { Flame, Menu, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleNavigation = (path: string) => {
    setIsOpen(false); // Close mobile menu if open
    
    if (path === window.location.pathname) {
      // If we're already on the page, just scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Navigate to new page and scroll to top
      navigate(path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleLogoClick = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <nav className="fixed w-full z-50 bg-black/90 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <button 
            onClick={handleLogoClick}
            className="flex items-center hover:opacity-80 transition-opacity"
          >
            <Flame className="h-8 w-8 text-neon" />
            <span className="ml-2 text-xl font-montserrat font-bold">
              So Fire Fitness
            </span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => handleNavigation('/features')} 
              className="text-gray-300 hover:text-neon font-montserrat transition-colors duration-300"
            >
              Features
            </button>
            <button 
              onClick={() => handleNavigation('/pricing')} 
              className="text-gray-300 hover:text-neon font-montserrat transition-colors duration-300"
            >
              Pricing
            </button>
            <button 
              onClick={() => handleNavigation('/projects')} 
              className="text-gray-300 hover:text-neon font-montserrat transition-colors duration-300"
            >
              Projects
            </button>
            <button 
              onClick={() => handleNavigation('/community')} 
              className="text-gray-300 hover:text-neon font-montserrat transition-colors duration-300"
            >
              Community
            </button>
            {user ? (
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => handleNavigation('/dashboard')}
                  className="text-gray-300 hover:text-neon font-montserrat transition-colors duration-300"
                >
                  Dashboard
                </button>
                <button 
                  onClick={() => signOut()}
                  className="btn-primary"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => handleNavigation('/signin')}
                  className="text-gray-300 hover:text-neon font-montserrat transition-colors duration-300"
                >
                  Sign In
                </button>
                <button 
                  onClick={() => handleNavigation('/signup')}
                  className="btn-primary"
                >
                  Get Started
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-neon"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <button
                onClick={() => handleNavigation('/features')}
                className="block w-full text-left px-3 py-2 text-base font-montserrat text-gray-300 hover:text-neon transition-colors duration-300"
              >
                Features
              </button>
              <button
                onClick={() => handleNavigation('/pricing')}
                className="block w-full text-left px-3 py-2 text-base font-montserrat text-gray-300 hover:text-neon transition-colors duration-300"
              >
                Pricing
              </button>
              <button
                onClick={() => handleNavigation('/projects')}
                className="block w-full text-left px-3 py-2 text-base font-montserrat text-gray-300 hover:text-neon transition-colors duration-300"
              >
                Projects
              </button>
              <button
                onClick={() => handleNavigation('/community')}
                className="block w-full text-left px-3 py-2 text-base font-montserrat text-gray-300 hover:text-neon transition-colors duration-300"
              >
                Community
              </button>
              {user ? (
                <>
                  <button
                    onClick={() => handleNavigation('/dashboard')}
                    className="block w-full text-left px-3 py-2 text-base font-montserrat text-gray-300 hover:text-neon transition-colors duration-300"
                  >
                    Dashboard
                  </button>
                  <button 
                    onClick={() => {
                      signOut();
                      setIsOpen(false);
                    }}
                    className="w-full btn-primary mt-4"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleNavigation('/signin')}
                    className="block w-full text-left px-3 py-2 text-base font-montserrat text-gray-300 hover:text-neon transition-colors duration-300"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => handleNavigation('/signup')}
                    className="w-full btn-primary mt-4"
                  >
                    Get Started
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;