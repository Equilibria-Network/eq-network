// src/components/Home2/Research.js
import React, { useState } from 'react';
import styles from './Research.module.css';
import { ChevronDown } from 'lucide-react';

export default function Research() {
  const [expandedFaq, setExpandedFaq] = useState(null);

  const streams = [
    {
      id: 'simulations',
      title: 'Agent-Based Simulations',
      claim: 'We discover collective behavior laws that no human observation could find.',
      image: '/img/home/research/agent_based_model.svg',
      description: 'We can run thousands of controlled experiments on societal simulations - impossible in the real world but essential for discovering mathematical laws of collective behavior.',
      example: 'We simulated a democratic voting system under systematic attack by bad actors. Political scientists predicted breakdown at 50% adversarial infiltration, but our simulations revealed democracy surviving until 90% - with moderate attacks actually strengthening the system. This hidden resilience pattern explains why some online communities and democratic institutions resist information warfare while others collapse, and shows how to design AI governance systems that get stronger under pressure.',
      faqs: [
        {
          question: 'Are you claiming you can test governance mechanisms before deploying them on real populations?',
          answer: 'Yes. We can model how democratic systems break down, how coordination mechanisms fail, how multi-agent AI systems go rogue - and test interventions before implementing them on millions of people. It\'s like having a laboratory for collective decision-making.'
        },
        {
          question: 'Can you really predict something as chaotic and complex as collective behavior?',
          answer: 'We don\'t predict the weather - we predict the climate. We can\'t tell you if a specific democracy will fail next Tuesday, but we can prove mathematical laws about when democratic systems become unstable. Just like climatologists can\'t predict tomorrow\'s weather but can predict long-term warming trends.'
        },
        {
          question: 'Why hasn\'t someone already built these simulations? What makes yours different from existing agent-based models?',
          answer: 'Existing simulations use hand-coded rules that don\'t scale or generalize. We use LLMs as cognitive engines with mathematical foundations underneath. This gives us bounded rationality without having to program every possible behavior, plus formal guarantees about what our results actually mean.'
        }
      ]
    },
    {
      id: 'foundations',
      title: 'Mathematical Foundations',
      claim: 'We\'re discovering the mathematical laws that govern all collective intelligence.',
      image: '/img/home/research/mathematical_foundations.svg',
      description: 'We use category theory to import proven theorems from network science directly into social systems, creating a "periodic table" of coordination mechanisms instead of building new math from scratch.',
      example: 'We developed frameworks showing that markets, networks, and democracies aren\'t cultural accidents - they\'re optimal solutions to different information processing problems. Markets for compressible information (prices), networks for local structure, democracies for aggregation. This explains why the same structures appear from ant colonies to AI systems, and lets us predict which coordination mechanisms will emerge in new domains like multi-agent AI.',
      faqs: [
        {
          question: 'You\'re claiming coordination mechanisms follow mathematical laws like crystals forming?',
          answer: 'Yes. We\'re proving that markets, democracies, and networks aren\'t cultural accidents - they\'re mathematically optimal solutions to different information processing problems. Just like physics explains why crystals form specific shapes, we\'re discovering the mathematical principles that explain why specific coordination structures emerge.'
        },
        {
          question: 'Isn\'t this just game theory or multi-agent reinforcement learning with fancy math words?',
          answer: 'Game theory assumes fixed rules and perfect rationality. Multi-agent RL finds good strategies within existing games. We\'re discovering the mathematical principles that determine which coordination structures emerge in the first place - why markets work for some problems, why democracies exist at all.'
        },
        {
          question: 'Why hasn\'t someone already solved this? Surely mathematicians have studied collective behavior before.',
          answer: 'They have - but in isolated domains. Economists study markets, political scientists study democracy, computer scientists study networks. Category theory lets us import proven theorems from all these fields into one unified framework. We\'re not inventing new math, we\'re finding the hidden connections between existing math.'
        }
      ]
    }
  ];

  const toggleFaq = (streamId, faqIndex) => {
    const key = `${streamId}-${faqIndex}`;
    setExpandedFaq(expandedFaq === key ? null : key);
  };

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {/* Section Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>Two Core Research Streams</h2>
        </div>

        {/* Two Streams - Left/Right Layout */}
        <div className={styles.streamsContainer}>
          {streams.map((stream) => (
            <div key={stream.id} className={styles.stream}>
              <div className={styles.streamContent}>
                
                {/* Left Side - Scanning */}
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
                  
                  {/* Example */}
                  <div className={styles.detailSection}>
                    <h4 className={styles.detailTitle}>Example</h4>
                    <div className={styles.detailText}>
                      {stream.example.split('\n\n').map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                      ))}
                    </div>
                  </div>

                  {/* Questions & Answers - Direct Expandable */}
                  <div className={styles.faqContainer}>
                    {stream.faqs.map((faq, faqIndex) => {
                      const faqKey = `${stream.id}-${faqIndex}`;
                      const isExpanded = expandedFaq === faqKey;

                      return (
                        <div key={faqIndex} className={styles.faqItem}>
                          <button 
                            className={styles.faqQuestion}
                            onClick={() => toggleFaq(stream.id, faqIndex)}
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
                    <a href="/research" className={styles.learnMoreLink}>
                      Learn more about our research →
                    </a>
                  </div>

                </div>

              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
