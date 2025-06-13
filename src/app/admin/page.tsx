'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Tag, Post } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import Layout from '@/components/Layout';

export default function AdminPage() {
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostTags, setNewPostTags] = useState<number[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();
  const { isLoggedIn, userData, isLoading: authLoading } = useAuth();
  
  useEffect(() => {
    if (!authLoading && !isLoggedIn) {
      router.push('/login');
      return;
    }
    if (!authLoading && isLoggedIn) {
      fetchTags();
    }
  }, [isLoggedIn, authLoading, router]);
  
  const fetchTags = async () => {
    try {
      const apiBaseUrl = typeof window !== 'undefined' ? window.globalState.apiBaseUrl : '/api';
      const response = await fetch(`${apiBaseUrl}/tags`);
      
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des tags');
      }
      
      const data = await response.json() as Tag[];
      setTags(data);
    } catch (err) {
      console.error('Erreur:', err);
    }
  };
  
  const handleTagSelection = (tagId: number) => {
    setNewPostTags((prevTags) => {
      if (prevTags.includes(tagId)) {
        return prevTags.filter((id) => id !== tagId);
      } else {
        return [...prevTags, tagId];
      }
    });
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLoggedIn || !userData) {
      alert('Vous devez être connecté pour créer un article');
      router.push('/login');
      return;
    }
    
    if (!newPostTitle.trim() || !newPostContent.trim()) {
      alert('Veuillez remplir tous les champs');
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      
      const apiBaseUrl = typeof window !== 'undefined' ? window.globalState.apiBaseUrl : '/api';
      const response = await fetch(`${apiBaseUrl}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: newPostTitle,
          content: newPostContent,
          author: userData.username,
          tags: newPostTags,
        } as Post),
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la création de l\'article');
      }
      
      setNewPostTitle('');
      setNewPostContent('');
      setNewPostTags([]);
      
      alert('Article créé avec succès !');
      router.push('/');
    } catch (err) {
      console.error('Erreur:', err);
      setError('Erreur lors de la création de l\'article');
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return <Layout><div>Chargement...</div></Layout>;
  }

  return (
    <Layout>
      <div className="admin-container">
        <h2>Administration</h2>
        
        {!isLoggedIn && (
          <div className="unauthorized">
            <p>Vous devez être connecté pour accéder à cette page</p>
            <button onClick={() => router.push('/login')}>
              Aller à la page de connexion
            </button>
          </div>
        )}
        
        {isLoggedIn && (
          <div className="create-post-form">
            <h3>Créer un nouvel article</h3>
            
            <form onSubmit={handleCreatePost}>
              <div className="form-group">
                <label htmlFor="title">Titre</label>
                <input
                  type="text"
                  id="title"
                  value={newPostTitle}
                  onChange={(e) => setNewPostTitle(e.target.value)}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="content">Contenu</label>
                <textarea
                  id="content"
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  rows={10}
                />
              </div>
              
              <div className="form-group">
                <label>Tags</label>
                <div className="tags-selection">
                  {tags.length === 0 ? (
                    <p>Chargement des tags...</p>
                  ) : (
                    tags.map((tag) => (
                      <label key={tag.id} className="tag-checkbox">
                        <input
                          type="checkbox"
                          checked={newPostTags.includes(tag.id!)}
                          onChange={() => handleTagSelection(tag.id!)}
                        />
                        <span className="tag-title">{tag.title}</span>
                      </label>
                    ))
                  )}
                </div>
              </div>
              
              <button type="submit" disabled={isLoading}>
                {isLoading ? 'Publication en cours...' : 'Publier'}
              </button>
              
              {error && <p className="error">{error}</p>}
            </form>
          </div>
        )}
        
        <div className="admin-footer">
          <Link href="/">Retour à l&apos;accueil</Link>
        </div>
      </div>
    </Layout>
  );
}
