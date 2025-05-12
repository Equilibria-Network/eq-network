// src/theme/BlogListPage/index.js
import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import { CalendarIcon, ClockIcon, ArrowRightIcon } from 'lucide-react';
import FeaturedImageFallback from './components/FeaturedImageFallback';
import './styles.css';

export default function BlogListPage(props) {
  const { items } = props;

  // Get a random but slight rotation for cards (-0.5 to 0.5 degrees)
  const getRandomRotation = () => {
    return (Math.random() - 0.5).toFixed(2);
  };

  return (
    <Layout
      title="Blog"
      description="Equilibria Network Blog - Insights on collective intelligence, AI governance, and complex systems"
    >
      <div className="parallax-background" />
      
      <div className="blog-header">
        <div className="container">
          <div className="blog-header-content">
            <h1 className="blog-title">Blog</h1>
            <p className="blog-subtitle">
              Insights on collective intelligence, AI governance, and complex systems
            </p>
          </div>
        </div>
      </div>
      
      <main className="blog-main">
        <div className="container">
          {/* Posts Grid */}
          <div className="posts-grid">
            {items.map(({ content: BlogPostContent }, index) => (
              <article 
                key={BlogPostContent.metadata.permalink} 
                className="post-card"
                style={{ transform: `rotate(${getRandomRotation()}deg)` }}
              >
                {/* Featured Image or Fallback */}
                <div className="post-image">
                  <Link to={BlogPostContent.metadata.permalink}>
                    {BlogPostContent.metadata.frontMatter && BlogPostContent.metadata.frontMatter.image ? (
                      <img src={BlogPostContent.metadata.frontMatter.image} alt={BlogPostContent.metadata.title} />
                    ) : (
                      <FeaturedImageFallback title={BlogPostContent.metadata.title} />
                    )}
                  </Link>
                </div>
                
                <div className="post-content">
                  {/* Meta info */}
                  <div className="post-meta">
                    <div className="post-date">
                      <CalendarIcon size={14} />
                      <time dateTime={BlogPostContent.metadata.date}>
                        {new Date(BlogPostContent.metadata.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </time>
                    </div>
                    
                    {BlogPostContent.metadata.readingTime && (
                      <div className="post-reading-time">
                        <ClockIcon size={14} />
                        <span>{Math.ceil(BlogPostContent.metadata.readingTime)} min read</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Title */}
                  <h2 className="post-title">
                    <Link to={BlogPostContent.metadata.permalink}>
                      {BlogPostContent.metadata.title}
                    </Link>
                  </h2>
                  
                  {/* Description */}
                  <p className="post-description">
                    {BlogPostContent.metadata.description}
                  </p>
                  
                  {/* Read Button (Centered) */}
                  <div className="read-button-container">
                    <Link to={BlogPostContent.metadata.permalink} className="read-button">
                      <span>Read</span>
                      <ArrowRightIcon size={18} />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
          
          {/* Show message if no posts */}
          {items.length === 0 && (
            <div className="no-posts">
              <h3>No posts found</h3>
              <p>Check back later for new content.</p>
            </div>
          )}
        </div>
      </main>
    </Layout>
  );
}
