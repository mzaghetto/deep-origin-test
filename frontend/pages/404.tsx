import styles from '../styles/Home.module.css';
export default function Custom404() {
  return (
    <div className={styles.container} style={{ textAlign: 'center' }}>
      <h1 className={styles.title}>404 - Invalid Slug</h1>
      <p>The URL you are looking for does not exist or is invalid.</p>
    </div>
  );
}