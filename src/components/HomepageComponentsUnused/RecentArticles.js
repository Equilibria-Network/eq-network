// src/components/HomepageComponents/RecentArticles.js
import React, { useState, useRef } from 'react';
import Link from '@docusaurus/Link';
import styles from './RecentArticles.module.css';

const ChevronLeft = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none">
    <polyline points="15 18 9 12 15 6"></polyline>
  </svg>
);

const ChevronRight = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none">
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);

function ArticleCard({ frontMatter, metadata }) {
  const {
    title,
    description,
    date,
    authors,
    readingTime,
  } = frontMatter;

  return (
    <div className={styles.articleCard}>
      <div className={styles.card}>
        <div className={styles.articleGrid}>
          {/* Left side - metadata */}
          <div className={styles.articleMeta}>
            {authors?.[0] && (
              <div className={styles.author}>
                {authors[0].name}
              </div>
            )}
            <div className={styles.metaDetails}>
              <time dateTime={date}>
                {new Date(date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
              {readingTime && (
                <>
                  <span className={styles.metaDivider}>·</span>
                  <span>{Math.ceil(readingTime)} min read</span>
                </>
              )}
            </div>
          </div>

          {/* Right side - content */}
          <div className={styles.articleContent}>
            <h3 className={styles.articleTitle}>
              <Link to={metadata.permalink}>{title}</Link>
            </h3>
            {description && (
              <p className={styles.articleDescription}>{description}</p>
            )}
            <Link 
              to={metadata.permalink} 
              className={styles.readMore}
              aria-label={`Read more about ${title}`}
            >
              Read More →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RecentArticles() {
  const scrollRef = useRef(null);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftButton(scrollLeft > 0);
      setShowRightButton(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  // Sample articles
  const samplePosts = [
    {
      frontMatter: {
        title: "Network Theory and Human Coordination",
        description: "An exploration of how network structures influence group decision-making and collective intelligence in modern organizations. Understanding these patterns helps us build better systems.",
        date: "2024-01-10T00:00:00.000Z",
        authors: [{ name: "Jonas Hallgren" }],
        readingTime: 8
      },
      metadata: { permalink: "/blog/network-theory" }
    },
    {
      frontMatter: {
        title: "The Future of Collective Intelligence",
        description: "Examining how emerging technologies and human wisdom can combine to create more effective decision-making systems for complex challenges.",
        date: "2024-01-08T00:00:00.000Z",
        authors: [{ name: "Markov" }],
        readingTime: 6
      },
      metadata: { permalink: "/blog/collective-intelligence" }
    },
    // Add more sample posts as needed
  ];

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.card}>
            <h2 className={styles.title}>Recent Articles</h2>
            <p className={styles.subtitle}>
              Explore our latest insights and research on human-AI coordination, 
              collective intelligence, and network theory.
            </p>
          </div>
        </div>
        
        <div className={styles.carouselContainer}>
          {showLeftButton && (
            <button 
              className={`${styles.scrollButton} ${styles.scrollButtonLeft}`}
              onClick={() => scroll('left')}
              aria-label="View previous articles"
            >
              <ChevronLeft />
            </button>
          )}
          
          <div 
            className={styles.articlesCarousel} 
            ref={scrollRef}
            onScroll={handleScroll}
          >
            {samplePosts.map((post, index) => (
              <ArticleCard key={index} {...post} />
            ))}
          </div>

          {showRightButton && (
            <button 
              className={`${styles.scrollButton} ${styles.scrollButtonRight}`}
              onClick={() => scroll('right')}
              aria-label="View more articles"
            >
              <ChevronRight />
            </button>
          )}
        </div>

        <div className={styles.allArticles}>
          <Link to="/blog" className={styles.allArticlesLink}>
            View All Articles →
          </Link>
        </div>
      </div>
    </section>
  );
}
