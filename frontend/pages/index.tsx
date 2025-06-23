import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../styles/Home.module.css';
import Toast from '../components/Toast';
import Logo from '../components/Logo';
import EditUrlModal from '../components/EditUrlModal';
import ShortenerForm from '../components/ShortenerForm';
interface UrlItem {
  slug: string;
  url: string;
  shortUrl: string;
  visits: number;
  createdAt: string;
}
interface HomeProps {
  reloadUrls: boolean;
  setReloadUrls: (reload: boolean) => void;
}
export default function Home({ reloadUrls, setReloadUrls }: HomeProps) {
  const [shortUrl, setShortUrl] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [copiedResult, setCopiedResult] = useState(false);
  const [urls, setUrls] = useState<UrlItem[]>([]);
  const [isLogged, setIsLogged] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingSlug, setEditingSlug] = useState('');
  const [editingUrl, setEditingUrl] = useState('');
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const fetchUrls = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await axios.get<UrlItem[]>(`${API_URL}/urls`, { headers });
      setUrls(res.data);
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLogged(!!token);
    fetchUrls();
    setReloadUrls(false);
  }, [reloadUrls]);
  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopiedResult(true);
    setTimeout(() => setCopiedResult(false), 2000);
  };
  const handleCopyItem = (text: string, slug: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2000);
  };
  const handleEdit = (slug: string, url: string) => {
    setIsEditModalOpen(true);
    setEditingSlug(slug);
    setEditingUrl(url);
  };
  const [updateSuccess, setUpdateSuccess] = useState<string | null>(null);
  
  const handleSave = async () => {
    fetchUrls();
    return true;
  };

  const handleEditSave = async () => {
    setUpdateSuccess('URL updated successfully!');
    setTimeout(() => setUpdateSuccess(null), 3000);
    fetchUrls();
    return true;
  };
  return (
    <div>
      <div className={styles.container}>
        {errorMsg && <Toast message={errorMsg} onClose={() => setErrorMsg(null)} />}
        <div className={styles.header}>
          <Logo />
          <span className={styles.logoText}>URL Shortener</span>
        </div>
        <ShortenerForm 
          onShorten={(resultUrl) => {
            setShortUrl(resultUrl);
            fetchUrls();
          }}
          setErrorMsg={setErrorMsg}
        />
        {shortUrl && (
          <div className={styles.shortUrl}>
            <a href={shortUrl} target="_blank" rel="noopener noreferrer">
              {shortUrl}
            </a>
            <button
              type="button"
              className={copiedResult ? styles.copiedButton : styles.button}
              onClick={handleCopy}
            >
              {copiedResult ? 'Copied!' : 'Copy'}
            </button>
          </div>
        )}
        {urls.length > 0 && <h2 className={styles.title}>Shortened URLs</h2>}
        <ul className={styles.list}>
          {urls.map((u) => (
            <li key={u.slug} className={styles.listItem}>
              <a href={u.shortUrl} target="_blank" rel="noopener noreferrer">
                {u.shortUrl}
              </a>
              <span className={styles.badge}>{u.visits} visits</span>
              <button
                type="button"
                className={copiedSlug === u.slug ? styles.copyButtonCopied : styles.copyButton}
                onClick={() => handleCopyItem(u.shortUrl, u.slug)}
                aria-label="Copy short URL"
              >
                {copiedSlug === u.slug ? 'Copied!' : (
                  <svg
                    className={styles.copyIcon}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 17 17"
                    stroke="currentColor"
                  >
                    <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1z"/>
                    <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0z"/>
                  </svg>
                )}
              </button>
              {isLogged && (
                <button type="button" className={styles.editButton} onClick={() => handleEdit(u.slug, u.url)}>
                  Edit
                </button>
              )}
            </li>
          ))}
        </ul>
        <EditUrlModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          slug={editingSlug}
          url={editingUrl}
          onSave={handleEditSave}
        />
        {updateSuccess && (
          <Toast
            message="URL updated successfully!"
            onClose={() => setUpdateSuccess(null)}
            type="success"
          />
        )}
      </div>
    </div>
  );
}
