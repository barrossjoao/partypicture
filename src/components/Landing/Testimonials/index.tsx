import React from 'react';
import styles from './styles.module.css';

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  event: string;
}

const Testimonials: React.FC = () => {
  const testimonials: Testimonial[] = [
    {
      quote: "Our wedding guests loved being able to contribute their photos in real-time. The polaroid feature was a huge hit!",
      author: "Sarah & Michael",
      role: "Newlyweds",
      event: "Wedding Reception"
    },
    {
      quote: "We used this for our annual corporate gala and it added an incredible interactive element that boosted engagement.",
      author: "James Wilson",
      role: "Event Director",
      event: "Corporate Gala"
    },
    {
      quote: "As a professional event planner, I now recommend this to all my clients. It's become an essential part of our offering.",
      author: "Elena Rodriguez",
      role: "Event Planner",
      event: "Multiple Events"
    }
  ];

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>What Our Customers Say</h2>
          <p className={styles.subtitle}>
            Real stories from real events that made memories last
          </p>
        </div>

        <div className={styles.grid}>
          {testimonials.map((testimonial, index) => (
            <div key={index} className={styles.card}>
              <div className={styles.quoteMark}>&quot;</div>
              <p className={styles.quote}>{testimonial.quote}</p>
              <div className={styles.authorInfo}>
                <p className={styles.author}>{testimonial.author}</p>
                <p className={styles.role}>{testimonial.role}</p>
                <p className={styles.event}>{testimonial.event}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
