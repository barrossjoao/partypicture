import React from 'react';
import styles from './styles.module.css';

const CallToAction: React.FC = () => {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.heading}>Ready to Transform Your Next Event?</h2>
        <p className={styles.subheading}>
          Join thousands of event hosts who are creating unforgettable, interactive experiences for their guests.
        </p>

        <div className={styles.pricingBox}>
          <div className={styles.grid}>
            <div className={styles.cardBasic}>
              <h3 className={styles.cardTitle}>Basic</h3>
              <p className={styles.cardSubtitle}>For smaller gatherings</p>
              <p className={styles.cardPrice}>$99<span className={styles.cardPriceUnit}>/event</span></p>
              <ul className={styles.cardFeatures}>
                <li><span>✓</span> Up to 100 guests</li>
                <li><span>✓</span> Real-time photo gallery</li>
                <li><span>✓</span> 14 days photo access</li>
              </ul>
            </div>

            <div className={styles.cardPremium}>
              <div className={styles.mostPopular}>MOST POPULAR</div>
              <h3 className={styles.cardTitle}>Premium</h3>
              <p className={styles.cardSubtitle}>For medium events</p>
              <p className={styles.cardPrice}>$199<span className={styles.cardPriceUnit}>/event</span></p>
              <ul className={styles.cardFeatures}>
                <li><span>✓</span> Up to 250 guests</li>
                <li><span>✓</span> Real-time photo gallery</li>
                <li><span>✓</span> Photo moderation</li>
                <li><span>✓</span> 30 days photo access</li>
              </ul>
            </div>

            <div className={styles.cardBasic}>
              <h3 className={styles.cardTitle}>Custom</h3>
              <p className={styles.cardSubtitle}>For large events</p>
              <p className={styles.cardPrice}>Custom<span className={styles.cardPriceUnit}></span></p>
              <ul className={styles.cardFeatures}>
                <li><span>✓</span> Unlimited guests</li>
                <li><span>✓</span> All premium features</li>
                <li><span>✓</span> Custom branding</li>
                <li><span>✓</span> Forever photo access</li>
              </ul>
            </div>
          </div>

          <button className={styles.ctaButton}>Get Started Free</button>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;