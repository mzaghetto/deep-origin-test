import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../styles/Header.module.css';

interface User {
  username: string;
  token: string;
}

interface HeaderProps {
  onLogin: () => void;
  onLogout: () => void;
}

export default function Header({ onLogin, onLogout }: HeaderProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const username = localStorage.getItem('username');
      if (username) {
        setUser({ username, token });
      }
    }
  }, []);

  const handleLogin = async () => {
    try {
      const res = await axios.post(`${API_URL}/auth/login`, { username, password });
      const token = res.data.token;
      localStorage.setItem('token', token);
      localStorage.setItem('username', username);
      setUser({ username, token });
      setErrorMsg(null);
      onLogin();
    } catch (error: any) {
      setErrorMsg(error.response?.data?.message || 'Failed to log in');
    }
  };

  const handleRegister = async () => {
    try {
      await axios.post(`${API_URL}/auth/register`, { username, password });
      setIsLogin(true);
      setSuccessMsg('User created!');
      setErrorMsg(null);
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (error: any) {
      setErrorMsg(error.response?.data?.message || 'Failed to create user');
      setSuccessMsg(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setUser(null);
    setUsername('');
    setPassword('');
    onLogout();
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {user ? (
          <div className={styles.userInfo}>
            <span>Hello, <b>{user.username}</b>!</span>
            <button className={styles.logoutButton} onClick={handleLogout}>Exit</button>
          </div>
        ) : (
          <div className={styles.authForm}>
            {isLogin ? (
              <div>
                <input
                  type="text"
                  placeholder="User"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button onClick={handleLogin}>Login</button>
                <button onClick={() => setIsLogin(false)}>Register</button>
              </div>
            ) : (
              <div>
                <input
                  type="text"
                  placeholder="User"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button onClick={handleRegister}>Criar</button>
                <button onClick={() => setIsLogin(true)}>Back to login</button>
              </div>
            )}
            {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}
            {successMsg && <p style={{ color: 'green' }}>{successMsg}</p>}
          </div>
        )}
      </div>
    </header>
  );
}
