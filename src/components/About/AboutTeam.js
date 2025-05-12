// src/components/About/AboutTeam.js
import React, { useState, useEffect } from 'react';
import styles from './AboutTeam.module.css';
import { Github, Linkedin, Twitter, X } from 'lucide-react';
import teamMembersData from '../../data/teamMembers.json';

export default function AboutTeam() {
  const [teamMembers, setTeamMembers] = useState([]);
  const [expandedMember, setExpandedMember] = useState(null);

  // Load team members from JSON file
  useEffect(() => {
    setTeamMembers(teamMembersData);
  }, []);

  const renderSocialLinks = (socials) => {
    return (
      <div className={styles.socialLinks}>
        {socials.twitter && (
          <a href={socials.twitter} target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="Twitter">
            <Twitter size={16} />
          </a>
        )}
        {socials.linkedin && (
          <a href={socials.linkedin} target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="LinkedIn">
            <Linkedin size={16} />
          </a>
        )}
        {socials.github && (
          <a href={socials.github} target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="GitHub">
            <Github size={16} />
          </a>
        )}
        {socials.lesswrong && (
          <a href={socials.lesswrong} target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="LessWrong">
            <img src="/socials/lesswrong.svg" alt="LessWrong" className={styles.socialSvg} />
          </a>
        )}
        {socials.arxiv && (
          <a href={socials.arxiv} target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="arXiv">
            <img src="/socials/arxiv.svg" alt="arXiv" className={styles.socialSvg} />
          </a>
        )}
      </div>
    );
  };

  const handleCardClick = (memberId) => {
    setExpandedMember(memberId);
  };

  const handleCloseDetails = (e) => {
    e.stopPropagation();
    setExpandedMember(null);
  };

  const expandedMemberData = expandedMember 
    ? teamMembers.find(member => member.id === expandedMember)
    : null;

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h1 className={styles.sectionTitle}>Our Team</h1>
        <p className={styles.sectionDescription}>
          We are a diverse group of researchers with backgrounds in complex systems, 
          mathematics, computational biology, and AI safety.
        </p>
        
        {!expandedMember ? (
          <div className={styles.teamGrid}>
            {teamMembers.map((member) => (
              <div 
                key={member.id} 
                className={styles.teamCard}
                onClick={() => handleCardClick(member.id)}
              >
                <div className={styles.teamImage}>
                  <img src={member.image} alt={member.name} />
                </div>
                <div className={styles.teamInfo}>
                  <h3 className={styles.teamName}>{member.name}</h3>
                  <p className={styles.teamRole}>{member.role}</p>
                  <p className={styles.teamBio}>{member.bio}</p>
                  {renderSocialLinks(member.socials)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.expandedView}>
            <button 
              className={styles.closeButton}
              onClick={handleCloseDetails}
              aria-label="Close details"
            >
              <X size={24} />
            </button>
            
            <div className={styles.expandedCard}>
              <div className={styles.expandedImageColumn}>
                <img 
                  src={expandedMemberData.image} 
                  alt={expandedMemberData.name} 
                  className={styles.expandedImage}
                />
              </div>
              
              <div className={styles.expandedContentColumn}>
                <h2 className={styles.expandedName}>{expandedMemberData.name}</h2>
                <p className={styles.expandedRole}>{expandedMemberData.role}</p>
                
                <div className={styles.expandedDetails}>
                  {expandedMemberData.details.split('\n\n').map((paragraph, index) => (
                    <p key={index} className={styles.detailsParagraph}>{paragraph}</p>
                  ))}
                </div>
                
                <div className={styles.expandedSocials}>
                  {renderSocialLinks(expandedMemberData.socials)}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
