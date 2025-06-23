import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../styles/EditUrlModal.module.css';
import { isValidUrl } from '../libs/validation';
import Toast from './Toast';


interface EditUrlModalProps {
  isOpen: boolean;
  onClose: () => void;
  slug: string;
  url: string;
  onSave: () => void;
}

export default function EditUrlModal({ isOpen, onClose, slug, url, onSave }: EditUrlModalProps) {
  const [protocol, setProtocol] = useState('https://');
  const [domain, setDomain] = useState('');
  const [newSlug, setNewSlug] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (url.startsWith('http://')) {
        setProtocol('http://');
        setDomain(url.replace('http://', ''));
      } else if (url.startsWith('https://')) {
        setProtocol('https://');
        setDomain(url.replace('https://', ''));
      } else {
        setDomain(url);
      }
      setNewSlug(slug);
    } else {
      setProtocol('https://');
      setDomain('');
      setNewSlug('');
    }
  }, [isOpen, url, slug]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const handleSave = async () => {
    setErrorMsg(null);

    const fullUrl = `${protocol}${domain.trim()}`;
    
    if (!domain.trim()) {
      setErrorMsg('Please, inform a valid domain');
      return;
    }

    if (!isValidUrl(fullUrl)) {
      setErrorMsg('Insert a valid URL or a complet domain');
      return;
    }

    const data: Record<string, string> = {};
    if (domain && `${protocol}${domain}` !== url) data.url = `${protocol}${domain}`;
    if (newSlug && newSlug !== slug) data.slug = newSlug;

    if (Object.keys(data).length === 0) {
      onClose();
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      await axios.put(`${API_URL}/${slug}`, data, { headers });
      
      setErrorMsg(null);
      onSave();
      onClose();
      return true;
    } catch (error: any) {
      let errorMessage = 'Unknown error occurred';
      
      if (error.code === 'ECONNABORTED') {
        errorMessage = 'Request timeout - server is not responding';
      } else if (error.response) {
        // The request was made and the server responded with a status code
        errorMessage = error.response.data?.message || 
                      error.response.statusText || 
                      `Server error: ${error.response.status}`;
      } else if (error.request) {
        // The request was made but no response was received
        errorMessage = 'No response from server - please check your connection';
      } else {
        // Other errors
        errorMessage = error.message || 'Unknown error occurred';
      }

      setErrorMsg(errorMessage);
      console.error('Edit URL error:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2>Edit URL</h2>
        {successMsg && (
          <Toast
            message={successMsg}
            onClose={() => setSuccessMsg(null)}
            type="success"
          />
        )}
        {errorMsg && <div className={styles.errorMessage}>{errorMsg}</div>}
        <div className={styles.form}>
          <div className={styles.inputGroup}>
            <label>URL</label>
            <div className={styles.urlInputWrapper}>
              <select
                id="protocolSelect"
                className={styles.protocolSelect}
                value={protocol}
                onChange={(e) => setProtocol(e.target.value)}
              >
                <option value="http://">http://</option>
                <option value="https://">https://</option>
              </select>
              <input
                id="domainInput"
                type="text"
                className={styles.domainInput}
                placeholder="exemplo.com"
                value={domain}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.startsWith('http://')) {
                    setProtocol('http://');
                    setDomain(value.replace('http://', ''));
                  } else if (value.startsWith('https://')) {
                    setProtocol('https://');
                    setDomain(value.replace('https://', ''));
                  } else if (value.includes('://')) {
                    const cleanValue = value.substring(value.indexOf('://') + 3);
                    setDomain(cleanValue);
                  } else {
                    setDomain(value);
                  }
                }}
              />
              {domain && (
                <button 
                  type="button" 
                  className={styles.clearButton}
                  onClick={() => setDomain('')}
                  aria-label="Clean flied"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="slugInput">Slug (optional)</label>
            <div className={styles.inputContainer}>
              <input
                id="slugInput"
                type="text"
                placeholder="example123"
                value={newSlug}
                onChange={(e) => setNewSlug(e.target.value)}
              />
              {newSlug && (
                <button 
                  type="button" 
                  className={styles.clearButton}
                  onClick={() => setNewSlug('')}
                  aria-label="Clean flied"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div className={styles.modalButtons}>
            <button className={styles.button} onClick={handleSave}>
              Save
            </button>
            <button className={`${styles.button} ${styles.cancelButton}`} onClick={onClose}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
