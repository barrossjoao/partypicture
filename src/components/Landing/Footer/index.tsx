import React from 'react';
import { Camera, Instagram, Facebook, Twitter } from 'lucide-react';
import styles from './styles.module.css';

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.brandSection}>
            <div className={styles.logoWrapper}>
              <Camera className={styles.logoIcon} />
              <span className={styles.logoText}>EventSnap</span>
            </div>
            <p className={styles.description}>
              Transform your events with real-time photo sharing that engages guests and creates lasting memories.
            </p>
            <div className={styles.socialLinks}>
              <a href="#" className={styles.socialIcon}><Instagram /></a>
              <a href="#" className={styles.socialIcon}><Facebook /></a>
              <a href="#" className={styles.socialIcon}><Twitter /></a>
            </div>
          </div>

          <div>
            <h3 className={styles.sectionTitle}>Product</h3>
            <ul className={styles.linkList}>
              <li><a href="#" className={styles.link}>Features</a></li>
              <li><a href="#" className={styles.link}>Pricing</a></li>
              <li><a href="#" className={styles.link}>Integrations</a></li>
              <li><a href="#" className={styles.link}>Demo</a></li>
            </ul>
          </div>

          <div>
            <h3 className={styles.sectionTitle}>Resources</h3>
            <ul className={styles.linkList}>
              <li><a href="#" className={styles.link}>Documentation</a></li>
              <li><a href="#" className={styles.link}>Guides</a></li>
              <li><a href="#" className={styles.link}>Success Stories</a></li>
              <li><a href="#" className={styles.link}>Blog</a></li>
            </ul>
          </div>

          <div>
            <h3 className={styles.sectionTitle}>Company</h3>
            <ul className={styles.linkList}>
              <li><a href="#" className={styles.link}>About Us</a></li>
              <li><a href="#" className={styles.link}>Careers</a></li>
              <li><a href="#" className={styles.link}>Contact</a></li>
              <li><a href="#" className={styles.link}>Privacy Policy</a></li>
            </ul>
          </div>
        </div>

        <div className={styles.bottomBar}>
          <p>© 2025 EventSnap. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;