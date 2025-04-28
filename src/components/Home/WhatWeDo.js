// src/components/HomepageComponents/WhatWeDo.js
import React, { useEffect, useRef, useState } from 'react';
import styles from './WhatWeDo.module.css';
import { Activity, Globe, GitBranch, ChevronDown } from 'lucide-react';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/animations/shift-away.css';
import { TopCurvedArrow, BottomCurvedArrow, VerticalArrow, VerticalDoubleArrow } from './Arrows';

export default function WhatWeDo() {
  const [expandedCard, setExpandedCard] = useState(null);
  const [animatedCards, setAnimatedCards] = useState([false, false, false]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 992);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const handleCardClick = (index) => {
    // Mark this card as having been animated
    const newAnimatedCards = [...animatedCards];
    newAnimatedCards[index] = true;
    setAnimatedCards(newAnimatedCards);
    
    // Toggle expanded state
    setExpandedCard(expandedCard === index ? null : index);
  };

  const cardData = [
    {
      id: 0,
      icon: <Activity size={32} />,
      title: "Identifying Core Needs in Technical AI Governance",
      summary: "Building a network of governance stakeholders to understand complex system challenges.",
      fullDescription: "We work on building a network of technical AI governance stakeholders to understand on-ground real-world complex system challenges. Understanding the needs of research, industry, and policy helps us identify concrete problems where system level thinking is needed—ensuring our work addresses practical governance issues rather than theoretical abstractions."
    },
    {
      id: 1,
      icon: <Globe size={32} />,
      title: "Building Simulation Frameworks",
      summary: "Developing agent-based models to visualize policy outcomes and reveal cascading effects.",
      fullDescription: "We build agent-based models that allow members of our network to visualize how their proposed policies might play out in practice. These simulations provide intuitive ways to test governance approaches before implementation, revealing potential cascading effects and unexpected macro system level consequences that might not be obvious from multi agent simulations alone."
    },
    {
      id: 2,
      icon: <GitBranch size={32} />,
      title: "Research Mathematical Foundations",
      summary: "Creating formal models of information flow, incentives, and coordination mechanisms.",
      fullDescription: "To power these simulations accurately, we're developing formal mathematical models that capture how information flows through networks of agents, how incentives shape behavior across systems, and how different coordination mechanisms respond under pressure. This theoretical work underpins our simulations and ensures they reflect real-world dynamics accurately."
    }
  ];

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
          {isMobile ? (
            // Mobile layout with vertical arrows
            <>
              {/* Card 1 */}
              <div className={styles.mobileCardContainer}>
                <div className={styles.card}>
                  <div 
                    className={`${styles.cardInner} ${expandedCard === 0 ? styles.expanded : ''}`}
                    onClick={() => handleCardClick(0)}
                  >
                    <div className={styles.cardIcon}>
                      {cardData[0].icon}
                    </div>
                    <h3 className={styles.cardTitle}>{cardData[0].title}</h3>
                    
                    <div className={styles.cardSummary}>
                      <p>{cardData[0].summary}</p>
                    </div>
                    
                    <div className={styles.cardDetails}>
                      <p>{cardData[0].fullDescription}</p>
                    </div>
                    
                    <div className={styles.expandIndicator}>
                      <ChevronDown size={20} className={expandedCard === 0 ? styles.rotated : ''} />
                    </div>
                  </div>
                </div>
                
                {/* Vertical Arrow */}
                <div className={styles.verticalArrow}>
                  <Tippy content="Problem identification informs simulation design" placement="right">
                    <div>
                      <VerticalArrow color="var(--ifm-color-primary)" />
                    </div>
                  </Tippy>
                </div>
              </div>

              {/* Card 2 */}
              <div className={styles.mobileCardContainer}>
                <div className={styles.card}>
                  <div 
                    className={`${styles.cardInner} ${expandedCard === 1 ? styles.expanded : ''}`}
                    onClick={() => handleCardClick(1)}
                  >
                    <div className={styles.cardIcon}>
                      {cardData[1].icon}
                    </div>
                    <h3 className={styles.cardTitle}>{cardData[1].title}</h3>
                    
                    <div className={styles.cardSummary}>
                      <p>{cardData[1].summary}</p>
                    </div>
                    
                    <div className={styles.cardDetails}>
                      <p>{cardData[1].fullDescription}</p>
                    </div>
                    
                    <div className={styles.expandIndicator}>
                      <ChevronDown size={20} className={expandedCard === 1 ? styles.rotated : ''} />
                    </div>
                  </div>
                </div>
                
                {/* Vertical Double Arrow */}
                <div className={styles.verticalDoubleArrow}>
                  <Tippy content="Simulations and mathematical models inform each other" placement="right">
                    <div>
                      <VerticalDoubleArrow color="var(--ifm-color-primary)" />
                    </div>
                  </Tippy>
                </div>
              </div>

              {/* Card 3 */}
              <div className={styles.card}>
                <div 
                  className={`${styles.cardInner} ${expandedCard === 2 ? styles.expanded : ''}`}
                  onClick={() => handleCardClick(2)}
                >
                  <div className={styles.cardIcon}>
                    {cardData[2].icon}
                  </div>
                  <h3 className={styles.cardTitle}>{cardData[2].title}</h3>
                  
                  <div className={styles.cardSummary}>
                    <p>{cardData[2].summary}</p>
                  </div>
                  
                  <div className={styles.cardDetails}>
                    <p>{cardData[2].fullDescription}</p>
                  </div>
                  
                  <div className={styles.expandIndicator}>
                    <ChevronDown size={20} className={expandedCard === 2 ? styles.rotated : ''} />
                  </div>
                </div>
              </div>
            </>
          ) : (
            // Desktop layout with horizontal arrows
            <>
              {/* Card 1 with top arrow */}
              <div className={styles.cardWithArrow}>
                <div className={styles.card}>
                  <div 
                    className={`${styles.cardInner} ${expandedCard === 0 ? styles.expanded : ''}`}
                    onClick={() => handleCardClick(0)}
                  >
                    <div className={styles.cardIcon}>
                      {cardData[0].icon}
                    </div>
                    <h3 className={styles.cardTitle}>{cardData[0].title}</h3>
                    
                    <div className={styles.cardSummary}>
                      <p>{cardData[0].summary}</p>
                    </div>
                    
                    <div className={styles.cardDetails}>
                      <p>{cardData[0].fullDescription}</p>
                    </div>
                    
                    <div className={styles.expandIndicator}>
                      <ChevronDown size={20} className={expandedCard === 0 ? styles.rotated : ''} />
                    </div>
                  </div>
                </div>
                
                {/* Top curved arrow */}
                <div className={styles.topArrow}>
                  <Tippy
                    content="Problem identification informs simulation design"
                    placement="top"
                  >
                    <div>
                      <TopCurvedArrow color="var(--ifm-color-primary)" />
                    </div>
                  </Tippy>
                </div>
              </div>

              {/* Card 2 with top arrow */}
              <div className={styles.cardWithArrow}>
                <div className={styles.card}>
                  <div 
                    className={`${styles.cardInner} ${expandedCard === 1 ? styles.expanded : ''}`}
                    onClick={() => handleCardClick(1)}
                  >
                    <div className={styles.cardIcon}>
                      {cardData[1].icon}
                    </div>
                    <h3 className={styles.cardTitle}>{cardData[1].title}</h3>
                    
                    <div className={styles.cardSummary}>
                      <p>{cardData[1].summary}</p>
                    </div>
                    
                    <div className={styles.cardDetails}>
                      <p>{cardData[1].fullDescription}</p>
                    </div>
                    
                    <div className={styles.expandIndicator}>
                      <ChevronDown size={20} className={expandedCard === 1 ? styles.rotated : ''} />
                    </div>
                  </div>
                </div>
                
                {/* Top curved arrow */}
                <div className={styles.topArrow}>
                  <Tippy
                    content="Simulations inform mathematical research"
                    placement="top"
                  >
                    <div>
                      <TopCurvedArrow color="var(--ifm-color-primary)" />
                    </div>
                  </Tippy>
                </div>
              </div>

              {/* Card 3 with bottom return arrow */}
              <div className={styles.cardWithBottomArrow}>
                <div className={styles.card}>
                  <div 
                    className={`${styles.cardInner} ${expandedCard === 2 ? styles.expanded : ''}`}
                    onClick={() => handleCardClick(2)}
                  >
                    <div className={styles.cardIcon}>
                      {cardData[2].icon}
                    </div>
                    <h3 className={styles.cardTitle}>{cardData[2].title}</h3>
                    
                    <div className={styles.cardSummary}>
                      <p>{cardData[2].summary}</p>
                    </div>
                    
                    <div className={styles.cardDetails}>
                      <p>{cardData[2].fullDescription}</p>
                    </div>
                    
                    <div className={styles.expandIndicator}>
                      <ChevronDown size={20} className={expandedCard === 2 ? styles.rotated : ''} />
                    </div>
                  </div>
                </div>
                
                {/* Bottom return arrow */}
                <div className={styles.bottomArrow}>
                  <Tippy
                    content="Mathematical models improve simulation accuracy"
                    placement="bottom"
                  >
                    <div>
                      <BottomCurvedArrow color="var(--ifm-color-primary)" />
                    </div>
                  </Tippy>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
