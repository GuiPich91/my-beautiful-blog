'use client';

import { useState, useEffect } from 'react';
import { Post } from '@/types';
import { usePagination } from '@/hooks/usePagination';
import Layout from '@/components/Layout';
import Pagination from '@/components/Pagination';

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const { currentPage, totalPages, handlePageChange, updateTotalPages } = usePagination();
  
  useEffect(() => {
    fetchPosts();
  }, [currentPage]);
  
  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const apiBaseUrl = typeof window !== 'undefined' ? window.globalState.apiBaseUrl : '/api';
      const response = await fetch(`${apiBaseUrl}/posts?page=${currentPage}&limit=10`);
      
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des articles');
      }
      
      const data = await response.json();
      
      const transformedPosts = data.data.map((post: Post) => ({
        ...post,
        date: post.date ? new Date(post.date).toLocaleDateString('fr-FR') : 'Date inconnue',
      }));
      
      setPosts(transformedPosts);
      updateTotalPages(data.total);
    } catch (err) {
      console.error('Erreur:', err);
      setError('Impossible de charger les articles');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Layout>
      <div className="post-list-container">
        <h2>Articles récents</h2>
        
        {isLoading && <p>Chargement...</p>}
        
        {error && <p className="error">{error}</p>}
        
        {!isLoading && !error && posts.length === 0 && (
          <p>Aucun article disponible</p>
        )}
        
        {posts.map((post) => (
          <div key={post.id} className="post-card">
            <h3>{post.title}</h3>
            <p>{post.content}</p>
            <div className="post-meta">
              <span>Par {post.author}</span>
              <span>Le {post.date}</span>
            </div>
            {post.tagObjects && post.tagObjects.length > 0 && (
              <div className="post-tags">
                {post.tagObjects.map((tag) => (
                  <span key={tag.id} className="tag">
                    {tag.title}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
        
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </Layout>
  );
}
