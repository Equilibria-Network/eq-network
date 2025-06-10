// src/components/Home2/FoundationsSection.js
import React, { useState } from 'react';
import styles from './FoundationsSection.module.css';
import { ChevronDown } from 'lucide-react';

// Import centralized content
import homeContent from '../../data/home.json';

export default function FoundationsSection() {
  const [expandedFaq, setExpandedFaq] = useState(null);

  const { research } = homeContent;
  const stream = research.streams.find(s => s.id === 'foundations');
  const { config } = research;

  const toggleFaq = (faqIndex) => {
    setExpandedFaq(expandedFaq === faqIndex ? null : faqIndex);
  };

  return (
    <section className={`${styles.section} snap-section`}>
      <div className={styles.container}>
        <div className={styles.streamContent}>
          
          {/* Left Side - Main Content */}
          <div className={styles.streamMain}>
            <h3 className={styles.streamTitle}>{stream.title}</h3>
            
            <p className={styles.boldClaim}>
              {stream.claim}
            </p>
            
            <div className={styles.imageContainer}>
              <img 
                src={stream.image}
                alt={stream.title}
                className={styles.streamImage}
              />
            </div>
            
            <p className={styles.description}>
              {stream.description}
            </p>
          </div>

          {/* Right Side - Details */}
          <div className={styles.streamDetails}>
            
            {/* Example - conditionally render */}
            {!stream.hideExample && (
              <div className={styles.detailSection}>
                <h4 className={styles.detailTitle}>Example</h4>
                <div className={styles.detailText}>
                  {stream.example}
                </div>
              </div>
            )}

            {/* Questions & Answers - Direct Expandable */}
            <div className={styles.faqContainer}>
              {stream.faqs.map((faq, faqIndex) => {
                const isExpanded = expandedFaq === faqIndex;

                return (
                  <div key={faqIndex} className={styles.faqItem}>
                    <button 
                      className={styles.faqQuestion}
                      onClick={() => toggleFaq(faqIndex)}
                    >
                      <span>{faq.question}</span>
                      <ChevronDown 
                        size={16} 
                        className={`${styles.faqIcon} ${isExpanded ? styles.faqIconExpanded : ''}`} 
                      />
                    </button>
                    {isExpanded && (
                      <div className={styles.faqAnswer}>
                        <p>{faq.answer}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Learn More Link */}
            <div className={styles.learnMore}>
              <a href={config.learnMoreLink} className={styles.learnMoreLink}>
                {config.learnMoreText}
              </a>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
