import type { AppProps } from 'next/app';
import '../styles/globals.css';
import Header from '../components/Header';
import { useState } from 'react';

export default function MyApp({ Component, pageProps }: AppProps) {
  const [reloadUrls, setReloadUrls] = useState(false);

  const handleLogin = () => {
    setReloadUrls(true);
  };

  const handleLogout = () => {
    setReloadUrls(true);
  };

  return (
    <>
      <Header onLogin={handleLogin} onLogout={handleLogout} />
      <Component {...pageProps} reloadUrls={reloadUrls} setReloadUrls={setReloadUrls} />
    </>
  );
}
