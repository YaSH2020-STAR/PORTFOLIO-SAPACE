import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { identity } from '../../data/portfolioData';
import { useScrollSpy, scrollToSection, type SectionId } from '../../hooks/useScrollSpy';

const navItems: { id: SectionId; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'projects', label: 'Projects' },
  { id: 'research', label: 'Research' },
  { id: 'product', label: 'Product' },
  { id: 'leadership', label: 'Leadership' },
  { id: 'odyssey', label: 'Odyssey' },
  { id: 'contact', label: 'Contact' },
];

const PortfolioNav: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const isScrollPage = location.pathname === '/';
  const activeId = useScrollSpy();

  const handleNavClick = (id: SectionId) => {
    setMobileOpen(false);
    if (isScrollPage) {
      scrollToSection(id);
    } else {
      // If we're not on home, navigate to home with hash (optional: scroll will happen on mount)
      window.location.href = `/#${id}`;
    }
  };

  const closeMobile = () => setMobileOpen(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-space/90 backdrop-blur-md border-b border-gloss-mid/40 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          <button
            type="button"
            onClick={() => isScrollPage ? scrollToSection('home') : window.location.assign('/')}
            className="font-display font-semibold text-silver-light hover:text-white transition-colors text-left"
          >
            {identity.name}
          </button>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-0.5">
            {navItems.map(({ id, label }) => {
              const isActive = activeId === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => handleNavClick(id)}
                  className={`px-3 py-2 text-sm rounded-md transition-colors duration-300 border-b-2 border-transparent ${
                    isActive ? 'text-white border-silver/40' : 'text-silver hover:text-white'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            className="md:hidden p-2 text-silver hover:text-white"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Menu"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden py-4 border-t border-gloss-mid/50">
            <div className="flex flex-col gap-0.5">
              {navItems.map(({ id, label }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => handleNavClick(id)}
                  className="px-3 py-2.5 text-left text-silver hover:text-white hover:bg-gloss/50 rounded-md transition-colors"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default PortfolioNav;
