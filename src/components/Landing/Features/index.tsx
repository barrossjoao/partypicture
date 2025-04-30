import React from 'react';
import { Camera, QrCode, LayoutGrid, ShieldCheck, Share2, Download } from 'lucide-react';
import styles from './styles.module.css';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
  return (
    <div className={styles.card}>
      <div className={styles.iconWrapper}>{icon}</div>
      <h3 className={styles.cardTitle}>{title}</h3>
      <p className={styles.cardDescription}>{description}</p>
    </div>
  );
};

const Features: React.FC = () => {
  const features = [
    {
      icon: <QrCode className={styles.icon} />,
      title: "QR Code Uploads",
      description: "Guests scan a QR code at their table to instantly upload photos from their phones."
    },
    {
      icon: <LayoutGrid className={styles.icon} />,
      title: "Real-time Gallery",
      description: "Photos appear instantly in a public gallery that can be displayed on screens at your event."
    },
    {
      icon: <ShieldCheck className={styles.icon} />,
      title: "Moderation Tools",
      description: "Admins can review, hide, or delete photos in real-time to ensure appropriate content."
    },
    {
      icon: <Camera className={styles.icon} />,
      title: "Multi-device Friendly",
      description: "Works seamlessly across all smartphones and tablets without requiring any app installation."
    },
    {
      icon: <Share2 className={styles.icon} />,
      title: "Social Sharing",
      description: "Guests can share photos directly to social media or download them with custom frames."
    },
    {
      icon: <Download className={styles.icon} />,
      title: "Polaroid Effects",
      description: "Add nostalgic polaroid frames to photos that guests can download and share."
    }
  ];

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.title}>Powerful Features for Memorable Events</h2>
          <p className={styles.subtitle}>
            All the tools you need to create an interactive, engaging photo experience for your guests.
          </p>
        </div>

        <div className={styles.grid}>
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;