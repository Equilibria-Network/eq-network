// src/theme/BlogListPage/FeaturedPosts.js
import React from 'react';
import Link from '@docusaurus/Link';
import { CalendarIcon, ArrowRightIcon } from 'lucide-react';
import FeaturedImageFallback from './FeaturedImageFallback';

export default function FeaturedPosts({ posts }) {
  // Only use the first featured post if available
  if (!posts || posts.length === 0) {
    return null;
  }

  const featuredPost = posts[0].content;

  return (
    <div className="featured-posts-section">
      <h2 className="featured-posts-title">Featured Post</h2>
      
      <div className="featured-post">
        <div className="featured-post-image">
          <Link to={featuredPost.metadata.permalink}>
            {featuredPost.metadata.frontMatter.image ? (
              <img 
                src={featuredPost.metadata.frontMatter.image} 
                alt={featuredPost.metadata.title} 
              />
            ) : (
              <FeaturedImageFallback title={featuredPost.metadata.title} />
            )}
          </Link>
        </div>
        
        <div className="featured-post-content">
          <div className="featured-post-meta">
            <div className="featured-post-date">
              <CalendarIcon size={16} />
              <time dateTime={featuredPost.metadata.date}>
                {new Date(featuredPost.metadata.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
            </div>
            
            {featuredPost.metadata.tags && featuredPost.metadata.tags.length > 0 && (
              <div className="featured-post-tag">
                {featuredPost.metadata.tags[0].label}
              </div>
            )}
          </div>
          
          <h2 className="featured-post-title">
            <Link to={featuredPost.metadata.permalink}>
              {featuredPost.metadata.title}
            </Link>
          </h2>
          
          <p className="featured-post-description">
            {featuredPost.metadata.description}
          </p>
          
          <Link to={featuredPost.metadata.permalink} className="featured-post-link">
            <span>Read Article</span>
            <ArrowRightIcon size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
