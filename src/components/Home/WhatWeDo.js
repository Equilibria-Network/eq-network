// src/components/HomepageComponents/WhatWeDo.js
import React, { useRef, useState, useEffect } from 'react';
import styles from './WhatWeDo.module.css';
import { 
  Activity, 
  Globe, 
  GitBranch, 
  ChevronRight, 
  ArrowRight, 
  ArrowLeft 
} from 'lucide-react';
import Tippy from '@tippyjs/react';

// Import JSON data
import whatWeDoData from '@site/src/data/whatwedo.json';

// Map icon names to components
const ICON_MAP = {
  Activity: Activity,
  Globe: Globe,
  GitBranch: GitBranch
};

export default function WhatWeDo() {
  const elementsRef = useRef([]);
  const [activeCard, setActiveCard] = useState(null);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add(styles.animate);
        }
      });
    }, observerOptions);

    elementsRef.current.forEach(ref => {
      if (ref) observer.observe(ref);
    });

    return () => {
      elementsRef.current.forEach(ref => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);

  const addToRefs = (el) => {
    if (el && !elementsRef.current.includes(el)) {
      elementsRef.current.push(el);
    }
  };

  const handleCardClick = (id) => {
    setActiveCard(activeCard === id ? null : id);
  };

  // Helper to render the icon component
  const renderIcon = (iconName) => {
    const IconComponent = ICON_MAP[iconName];
    return IconComponent ? <IconComponent size={32} /> : null;
  };

  // Helper to render an arrow connection
  const renderConnection = (connection) => {
    if (connection.type === 'bidirectional') {
      return (
        <Tippy 
          key={`connection-${connection.id}`}
          content={connection.tooltip} 
          placement="top"
          animation="shift-away"
        >
          <div ref={addToRefs} className={`${styles.arrowBidirectional} ${styles.arrowAppear}`}>
            <ArrowRight size={20} className={styles.arrowTop} />
            <ArrowLeft size={20} className={styles.arrowBottom} />
          </div>
        </Tippy>
      );
    } else {
      return (
        <Tippy 
          key={`connection-${connection.id}`}
          content={connection.tooltip} 
          placement="top"
          animation="shift-away"
        >
          <div ref={addToRefs} className={`${styles.arrowRight} ${styles.arrowAppear}`}>
            <ArrowRight size={24} />
          </div>
        </Tippy>
      );
    }
  };

  // Create an array of alternating cards and connections
  const createFlowElements = () => {
    const { cards, connections } = whatWeDoData;
    const elements = [];

    cards.forEach((card, index) => {
      // Add card
      elements.push(
        <div 
          key={`card-${card.id}`}
          ref={addToRefs} 
          className={`${styles.card} ${styles.cardAppear}`}
        >
          <div 
            className={`${styles.cardInner} ${activeCard === card.id ? styles.activeCard : ''}`}
            onClick={() => handleCardClick(card.id)}
          >
            <div className={styles.cardHeader}>
              <div className={styles.cardIcon}>
                {renderIcon(card.icon)}
              </div>
              <h3 className={styles.cardTitle}>{card.title}</h3>
            </div>
            
            <p className={styles.cardSummary}>{card.summary}</p>
            
            <div className={`${styles.cardDetails} ${activeCard === card.id ? styles.showDetails : ''}`}>
              <p>{card.fullDescription}</p>
            </div>
            
            <div className={styles.cardFooter}>
              <button className={styles.readMoreButton} aria-label="Read more">
                <span>{activeCard === card.id ? 'Read less' : 'Read more'}</span>
                <ChevronRight size={16} className={activeCard === card.id ? styles.chevronRotated : ''} />
              </button>
            </div>
          </div>
        </div>
      );

      // Add connection if not the last card
      if (index < cards.length - 1) {
        const connection = connections.find(c => c.fromCard === card.id && c.toCard === cards[index + 1].id);
        if (connection) {
          elements.push(renderConnection(connection));
        }
      }
    });

    return elements;
  };

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>What We Do</h2>
          <p className={styles.subtitle}>
            Our work is founded on the premise that many AI risks stem from the interaction of AI with other complex systems.
            System level emergent risks need systems level emergent safety properties.
          </p>
        </div>

        <div className={styles.processFlow}>
          {createFlowElements()}
        </div>
      </div>
    </section>
  );
}
