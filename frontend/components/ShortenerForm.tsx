import { useState } from 'react';
import axios from 'axios';
import styles from '../styles/Home.module.css';
import { isValidUrl } from '../libs/validation';
import Toast from './Toast';
interface ShortenerFormProps {
  onShorten: (shortUrl: string) => void;
}
export default function ShortenerForm({ onShorten }: ShortenerFormProps) {
  const [protocol, setProtocol] = useState('https://');
  const [domain, setDomain] = useState('');
  const [slug, setSlug] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const handleShorten = async () => {
    let errorMsg = null;
    if (!domain.trim()) {
      errorMsg = 'Please provide the domain';
      setErrorMsg(errorMsg);
      return;
    }
    let finalProtocol = protocol;
    if (domain.startsWith('http://')) {
      finalProtocol = 'http://';
      setDomain(domain.replace('http://', ''));
    } else if (domain.startsWith('https://')) {
      finalProtocol = 'https://';
      setDomain(domain.replace('https://', ''));
    }
    const fullUrl = `${finalProtocol}${domain.trim()}`;
    if (!isValidUrl(fullUrl)) {
      errorMsg = 'Enter a valid URL with a complete domain';
      setErrorMsg(errorMsg);
      return;
    }
    // Validate the slug if provided
    if (slug && !/^[a-zA-Z0-9-_]+$/.test(slug)) {
      setErrorMsg('Slug can only contain letters, numbers, hyphens, and underscores');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const payload = slug.trim()
        ? { url: fullUrl, slug: slug.trim() }
        : { url: fullUrl };
      const res = await axios.post(
        `${API_URL}/shorten`,
        payload,
        { headers }
      );
      onShorten(res.data.shortUrl);
      setDomain('');
      setSlug('');
      setSuccessMsg('URL encurtada criada com sucesso!');
      setErrorMsg(null);
    } catch (error: any) {
      if (error.response?.status === 409) {
        setErrorMsg(error.response?.data?.message || 'This slug is already in use');
      } else {
        setErrorMsg(error.response?.data?.error || 'Error creating short URL');
      }
    }
  };
  const isDisabled = !domain.trim() ||
                    (slug && !/^[a-zA-Z0-9-_]+$/.test(slug));
  return (
    <>
      {successMsg && (
        <Toast
          message={successMsg}
          onClose={() => setSuccessMsg(null)}
          type="success"
        />
      )}
      {errorMsg && (
        <Toast
          message={errorMsg}
          onClose={() => setErrorMsg(null)}
          type="error"
        />
      )}
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
              placeholder="example.com"
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
                  // Remove other protocols (ftp://, mailto:, etc)
                  const cleanValue = value.substring(value.indexOf('://') + 3);
                  setDomain(cleanValue);
                } else {
                  setDomain(value);
                }
              }}
              onPaste={(e) => {
                const pasted = e.clipboardData.getData('text');
                if (pasted.startsWith('http://')) {
                  setProtocol('http://');
                  setDomain(pasted.replace('http://', ''));
                  e.preventDefault();
                } else if (pasted.startsWith('https://')) {
                  setProtocol('https://');
                  setDomain(pasted.replace('https://', ''));
                  e.preventDefault();
                }
              }}
            />
            {domain && (
              <button
                type="button"
                className={styles.clearButton}
                onClick={() => setDomain('')}
                aria-label="Clear field"
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
              className={styles.input}
              placeholder="example"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
            />
            {slug && (
              <button
                type="button"
                className={styles.clearButton}
                onClick={() => setSlug('')}
                aria-label="Clear field"
              >
                ×
              </button>
            )}
          </div>
        </div>
        <button
          type="button"
          className={styles.button}
          onClick={handleShorten}
          disabled={isDisabled}
        >
          Shorten
        </button>
      </div>
    </>
  );
}
