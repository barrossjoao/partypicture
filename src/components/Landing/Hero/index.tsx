import React from 'react';
import { Camera, Share2, MonitorSmartphone } from 'lucide-react';
import styles from './styles.module.css';

const Hero: React.FC = () => {
  return (
    <section className={styles.section}>
      <div className={styles.decorTopRight}></div>
      <div className={styles.decorMidLeft}></div>

      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.leftContent}>
            <h1 className={styles.title}>
              Share Event Photos <br />
              <span className={styles.highlight}>in Real Time</span>
            </h1>
            <p className={styles.subtitle}>
              Transform your events with instant photo sharing. Guests scan a QR code, upload photos, and see them displayed live on screens throughout your venue.
            </p>
            <div className={styles.actions}>
              <button className={styles.primaryButton}>Start Free Trial</button>
              <button className={styles.secondaryButton}>See Demo</button>
            </div>
          </div>

          <div className={styles.rightContent}>
            <div className={styles.phoneWrapper}>
              <div className={styles.phoneMockup}>
                <div className={styles.phoneBackground}>
                  <div className={styles.phoneContent}>
                    <div className={styles.appUI}>
                      <div className={styles.appHeader}>
                        <span className={styles.appTitle}>Jessica's Wedding</span>
                        <Camera className={styles.iconWhite} />
                      </div>
                      <div className={styles.gallery}>
                        {[1, 2, 3, 4, 5, 6].map(index => (
                          <div
                            key={index}
                            className={styles.galleryItem}
                            style={{ animationDelay: `${index * 0.1}s` }}
                          >
                            <div className={styles.photoPlaceholder}>
                              <Share2 className={styles.iconPurple} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.floatTopRight}>
                <div className={styles.floatBox}>
                  <div className={styles.floatIcon}><Camera className={styles.iconPurple} /></div>
                  <div>
                    <p className={styles.floatTitle}>New photo!</p>
                    <p className={styles.floatSubtitle}>From Table 5</p>
                  </div>
                </div>
              </div>

              <div className={styles.floatBottomLeft}>
                <div className={styles.floatBox}>
                  <div className={styles.floatIcon}><MonitorSmartphone className={styles.iconPurple} /></div>
                  <div>
                    <p className={styles.floatTitle}>Live gallery</p>
                    <p className={styles.floatSubtitle}>80+ photos</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
