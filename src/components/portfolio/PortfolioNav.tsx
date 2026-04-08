import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { identity } from '../../data/portfolioData';
import { useScrollSpy, scrollToSection, type SectionId } from '../../hooks/useScrollSpy';

const navItems: { id: SectionId; label: string; href?: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'projects', label: 'Projects' },
  { id: 'research', label: 'Research' },
  { id: 'product', label: 'Product' },
  { id: 'leadership', label: 'Leadership' },
  { id: 'odyssey', label: 'Odyssey' },
  { id: 'contact', label: 'Contact' },
  { id: 'contact', label: 'Mechanical', href: '/mechanical' },
];

const PortfolioNav: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sfxEnabled, setSfxEnabled] = useState(true);
  const location = useLocation();
  const isScrollPage = location.pathname === '/';
  const activeId = useScrollSpy();

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem('terminalSfxEnabled');
      if (stored === '0') setSfxEnabled(false);
    } catch {
      // ignore storage failures
    }
  }, []);

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

  const toggleSfx = () => {
    const next = !sfxEnabled;
    setSfxEnabled(next);
    window.dispatchEvent(new CustomEvent('terminal-sfx:set-enabled', { detail: { enabled: next } }));
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-space/90 backdrop-blur-md border-b border-gloss-mid/40 transition-colors duration-300 font-typewriter">
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
            {navItems.map(({ id, label, href }, idx) => {
              const isActive = !href && activeId === id;
              if (href) {
                return (
                  <a
                    key={`nav-${label}`}
                    href={href}
                    className="px-3 py-2 text-sm rounded-md transition-colors duration-300 border-b-2 border-transparent text-silver hover:text-white"
                  >
                    {label}
                  </a>
                );
              }
              return (
                <button
                  key={`nav-${id}-${label}`}
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
            <button
              type="button"
              onClick={toggleSfx}
              className="ml-2 px-2.5 py-1.5 text-[11px] leading-none rounded border border-silver/30 bg-gloss/40 text-silver hover:text-white hover:border-silver/60 hover:bg-gloss/70 transition-colors font-typewriter tracking-wide"
              aria-label={sfxEnabled ? 'Mute terminal sounds' : 'Unmute terminal sounds'}
              title={sfxEnabled ? 'Mute terminal sounds' : 'Unmute terminal sounds'}
            >
              [{sfxEnabled ? 'SFX:ON' : 'SFX:OFF'}]
            </button>
          </div>

          {/* Mobile toggle */}
          <div className="md:hidden flex items-center gap-1">
            <button
              type="button"
              onClick={toggleSfx}
              className="px-2 py-1 text-[10px] leading-none rounded border border-silver/30 bg-gloss/40 text-silver hover:text-white hover:border-silver/60 hover:bg-gloss/70 transition-colors font-typewriter tracking-wide"
              aria-label={sfxEnabled ? 'Mute terminal sounds' : 'Unmute terminal sounds'}
            >
              [{sfxEnabled ? 'SFX:ON' : 'SFX:OFF'}]
            </button>
            <button
              type="button"
              className="p-2 text-silver hover:text-white"
              onClick={() => setMobileOpen((o) => !o)}
              aria-label="Menu"
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden py-4 border-t border-gloss-mid/50">
            <div className="flex flex-col gap-0.5">
              <button
                type="button"
                onClick={toggleSfx}
                className="px-3 py-2.5 text-left text-silver hover:text-white hover:bg-gloss/50 rounded-md transition-colors font-typewriter"
              >
                [{sfxEnabled ? 'SFX:ON' : 'SFX:OFF'}] {sfxEnabled ? 'Mute terminal sounds' : 'Unmute terminal sounds'}
              </button>
              {navItems.map(({ id, label, href }) =>
                href ? (
                  <a
                    key={`nav-m-${label}`}
                    href={href}
                    onClick={closeMobile}
                    className="px-3 py-2.5 text-left text-silver hover:text-white hover:bg-gloss/50 rounded-md transition-colors"
                  >
                    {label}
                  </a>
                ) : (
                  <button
                    key={`nav-m-${id}-${label}`}
                    type="button"
                    onClick={() => handleNavClick(id)}
                    className="px-3 py-2.5 text-left text-silver hover:text-white hover:bg-gloss/50 rounded-md transition-colors"
                  >
                    {label}
                  </button>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default PortfolioNav;
