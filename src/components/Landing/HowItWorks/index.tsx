import React from 'react';
import { QrCode, Camera, LayoutGrid, Download } from 'lucide-react';
import styles from './styles.module.css';

const steps = [
  {
    icon: <QrCode className={styles.icon} />,
    title: "Place QR Codes",
    description: "Position QR codes on tables or at designated spots throughout your venue.",
    color: styles.purple,
    image: "https://images.pexels.com/photos/6471934/pexels-photo-6471934.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
  },
  {
    icon: <Camera className={styles.icon} />,
    title: "Guests Upload Photos",
    description: "Guests scan the code and instantly upload photos from their phones.",
    color: styles.indigo,
    image: "https://images.pexels.com/photos/5256142/pexels-photo-5256142.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
  },
  {
    icon: <LayoutGrid className={styles.icon} />,
    title: "Photos Appear Live",
    description: "All uploads instantly appear in the event's gallery on screens.",
    color: styles.blue,
    image: "https://images.pexels.com/photos/7148384/pexels-photo-7148384.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
  },
  {
    icon: <Download className={styles.icon} />,
    title: "Download & Share",
    description: "Guests and hosts can download photos with stylish frames.",
    color: styles.coral,
    image: "https://images.pexels.com/photos/5824627/pexels-photo-5824627.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
  }
];

const HowItWorks: React.FC = () => {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>How It Works</h2>
          <p className={styles.subtitle}>
            A simple, seamless experience for both event hosts and guests
          </p>
        </div>

        <div className={styles.timelineWrapper}>
          <div className={styles.line}></div>
          <div className={styles.timeline}>
            {steps.map((step, index) => (
              <div
  key={index}
  className={`${styles.stepRow} ${index % 2 === 0 ? '' : styles.rowReverse}`.trim()}
>
                <div className={`${styles.imageCol} ${index % 2 === 0 ? styles.left : styles.right}`.trim()}>
                  <div className={styles.imageBox}>
                    <img src={step.image} alt={step.title} className={styles.image} />
                  </div>
                </div>

                <div className={styles.iconCol}>
                  <div className={`${styles.iconCircle} ${step.color}`}>{step.icon}</div>
                </div>

                <div className={`${styles.textCol} ${index % 2 === 0 ? styles.right : styles.left}`.trim()}>
                  <div className={styles.mobileTitle}>
                    <div className={`${styles.iconCircle} ${step.color}`}>{step.icon}</div>
                    <h3 className={styles.mobileStepTitle}>{step.title}</h3>
                  </div>
                  <div>
                    <h3 className={styles.stepTitle}>{step.title}</h3>
                    <p className={styles.stepDescription}>{step.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;