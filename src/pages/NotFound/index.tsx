import React from 'react';
import { Link } from 'react-router-dom';
import styles from './styles.module.css';

const NotFound: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.box}>
      <h1 className={styles.title}>404</h1>
      <p className={styles.message}>Ops... Página não encontrada.</p>
      <Link to="/" className={styles['home-link']}>Voltar para Home</Link>
      </div>

      <img className={styles.img} src="/404.png" alt="Gif de cachorro triste" />
    </div>
  );
};

export default NotFound;