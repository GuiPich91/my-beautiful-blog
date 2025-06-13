'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useDarkMode } from '@/hooks/useDarkMode';

export default function Header() {
  const { isLoggedIn, handleLogout } = useAuth();
  const { darkMode, toggleDarkMode } = useDarkMode();

  return (
    <header className="header">
      <div className="container">
        <h1>My Beautiful Blog</h1>
        <nav>
          <ul>
            <li><Link href="/">Accueil</Link></li>
            {isLoggedIn ? (
              <>
                <li><Link href="/admin">Administration</Link></li>
                <li><button onClick={handleLogout}>Déconnexion</button></li>
              </>
            ) : (
              <li><Link href="/login">Connexion</Link></li>
            )}
            <li>
              <button onClick={toggleDarkMode}>
                {darkMode ? 'Mode clair' : 'Mode sombre'}
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
} 