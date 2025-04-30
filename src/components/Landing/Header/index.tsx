import React, { useState, useEffect } from 'react';
import { Camera, Menu, X } from 'lucide-react';
import styles from './styles.module.css';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`${styles.header} ${
        isScrolled ? styles.scrolled : styles.transparent
      }`}
    >
      <div className={styles.container}>
        <div className={styles.inner}>
          <div className={styles.logoSection}>
            <Camera
              className={`${styles.icon} ${
                isScrolled ? styles.iconScrolled : styles.iconTransparent
              }`}
            />
            <span className={styles.logoText}>EventSnap</span>
          </div>

          <nav className={styles.desktopNav}>
            {['features', 'how-it-works', 'pricing', 'testimonials'].map((item) => (
              <a
                key={item}
                href={`#${item}`}
                className={`${styles.navLink} ${
                  isScrolled ? styles.linkScrolled : styles.linkTransparent
                }`}
              >
                {item.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </a>
            ))}
          </nav>

          <div className={styles.desktopCTA}>
            <a
              href="#login"
              className={`${styles.loginLink} ${
                isScrolled ? styles.linkScrolled : styles.linkTransparent
              }`}
            >
              Login
            </a>
            <a
              href="#signup"
              className={`${styles.signupButton} ${
                isScrolled ? styles.signupScrolled : styles.signupTransparent
              }`}
            >
              Sign Up
            </a>
          </div>

          <button
            className={styles.mobileToggle}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className={isScrolled ? styles.iconScrolled : styles.iconTransparent} />
            ) : (
              <Menu className={isScrolled ? styles.iconScrolled : styles.iconTransparent} />
            )}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className={styles.mobileMenu}>
          <div className={styles.container}>
            <nav className={styles.mobileNav}>
              {['features', 'how-it-works', 'pricing', 'testimonials'].map((item) => (
                <a
                  key={item}
                  href={`#${item}`}
                  className={styles.mobileLink}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </a>
              ))}
              <div className={styles.mobileCTA}>
                <a href="#login" className={styles.mobileLink}>Login</a>
                <a href="#signup" className={styles.mobileSignup}>Sign Up</a>
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;