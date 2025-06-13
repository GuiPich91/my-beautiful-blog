import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<Record<string, unknown> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      const userDataStr = localStorage.getItem('user');
      if (userDataStr) {
        try {
          const userDataObj = JSON.parse(userDataStr);
          setUserData(userDataObj);
          if (typeof window !== 'undefined') {
            window.globalState.isLoggedIn = true;
            window.globalState.userData = userDataObj;
          }
        } catch (err) {
          console.error('Erreur lors de la lecture des données utilisateur:', err);
        }
      }
    }
    setIsLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    if (typeof window !== 'undefined') {
      window.globalState.isLoggedIn = false;
      window.globalState.userData = null;
    }
    router.push('/');
  };

  return {
    isLoggedIn,
    userData,
    handleLogout,
    isLoading
  };
} 