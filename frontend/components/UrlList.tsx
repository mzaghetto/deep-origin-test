import { useState } from 'react';
import styles from '../styles/Home.module.css';
import EditUrlModal from './EditUrlModal';

interface UrlItem {
  slug: string;
  url: string;
  shortUrl: string;
  visits: number;
  createdAt: string;
}

interface UrlListProps {
  urls: UrlItem[];
  isLogged: boolean;
  refreshUrls: () => void;
}

export default function UrlList({ urls, isLogged, refreshUrls }: UrlListProps) {
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingSlug, setEditingSlug] = useState('');
  const [editingUrl, setEditingUrl] = useState('');

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

  const handleSave = () => {
    refreshUrls();
  };

  return (
    <>
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
              {copiedSlug === u.slug ? 'Copied!' : 'Copy'}
            </button>
            {isLogged && (
              <button type="button" className={styles.editButton} onClick={() => handleEdit(u.slug, u.url)}>
                Editar
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
        onSave={handleSave}
      />
    </>
  );
}
