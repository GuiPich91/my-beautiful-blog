import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@/types';
import type { GlobalState } from '@/types';

export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      const userDataStr = localStorage.getItem('user');
      if (userDataStr) {
        try {
          const userDataObj = JSON.parse(userDataStr) as User;
          setUserData(userDataObj);
          if (typeof window !== 'undefined') {
            window.globalState.isLoggedIn = true;
            (window.globalState as GlobalState).userData = userDataObj;
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