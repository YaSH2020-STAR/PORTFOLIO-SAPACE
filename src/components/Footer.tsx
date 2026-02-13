import React from 'react';
import { Flame, Instagram, Twitter, Facebook } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path: string) => {
    if (path.startsWith('/')) {
      navigate(path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (path.startsWith('#')) {
      if (path === '#blog' || path === '#faq') {
        // These features are coming soon
        alert('This feature is coming soon!');
      } else {
        // Find the element and scroll to it
        const element = document.getElementById(path.substring(1));
        if (element) {
          const navHeight = 64; // Height of the fixed navbar
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - navHeight;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        } else if (location.pathname !== '/') {
          // If we're not on the homepage, navigate there first
          navigate('/', { state: { scrollTo: path } });
        }
      }
    }
  };

  return (
    <footer className="bg-gray-dark">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <button 
              onClick={() => handleNavigation('/')}
              className="flex items-center mb-4 hover:opacity-80 transition-opacity"
            >
              <Flame className="h-8 w-8 text-neon" />
              <span className="ml-2 text-xl font-montserrat font-bold">
                So Fire Fitness
              </span>
            </button>
            <p className="text-gray-300 mb-4">
              Transform your body and mind with AI-powered fitness plans, 
              real community support, and rewards that keep you motivated.
            </p>
            <div className="flex space-x-4">
              <SocialLink href="https://instagram.com" icon={Instagram} />
              <SocialLink href="https://twitter.com" icon={Twitter} />
              <SocialLink href="https://facebook.com" icon={Facebook} />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <FooterLink onClick={() => handleNavigation('/features')}>Features</FooterLink>
              <FooterLink onClick={() => handleNavigation('/pricing')}>Pricing</FooterLink>
              <FooterLink onClick={() => handleNavigation('/community')}>Community</FooterLink>
              <FooterLink onClick={() => handleNavigation('#blog')}>Blog</FooterLink>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-bold mb-4">Support</h4>
            <ul className="space-y-2">
              <FooterLink onClick={() => handleNavigation('/faq')}>FAQ</FooterLink>
              <FooterLink onClick={() => handleNavigation('/contact')}>Contact Us</FooterLink>
              <FooterLink onClick={() => handleNavigation('/privacy')}>Privacy Policy</FooterLink>
              <FooterLink onClick={() => handleNavigation('/terms')}>Terms of Service</FooterLink>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} So Fire Fitness. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

const SocialLink = ({ href, icon: Icon }: { href: string; icon: any }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="text-gray-400 hover:text-neon transition-colors duration-300"
  >
    <Icon className="h-6 w-6" />
  </a>
);

const FooterLink = ({ onClick, children }: { onClick: () => void; children: React.ReactNode }) => (
  <li>
    <button
      onClick={onClick}
      className="text-gray-400 hover:text-neon transition-colors duration-300"
    >
      {children}
    </button>
  </li>
);

export default Footer;