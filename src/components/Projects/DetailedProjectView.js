// src/components/Projects/DetailedProjectView.js
import React from 'react';
import { 
  FileText, BookOpen, Target, Users, Briefcase, 
  Github, Twitter, Linkedin, Mail, Link,
  GitBranch
} from 'lucide-react';
import RoadmapSection from './RoadmapSection';
import styles from './DetailedProjectView.module.css';


const SectionTitle = ({ icon: Icon, children }) => (
  <div className={styles.sectionTitle}>
    <Icon size={20} className={styles.sectionIcon} />
    <h3>{children}</h3>
  </div>
);

const Section = ({ title, icon, children }) => (
  <section className={styles.section}>
    <SectionTitle icon={icon}>{title}</SectionTitle>
    <div className={styles.sectionContent}>
      {children}
    </div>
  </section>
);

const SocialLink = ({ type, url }) => {
  const icons = {
    github: Github,
    twitter: Twitter,
    linkedin: Linkedin,
    website: Link,
    email: Mail
  };
  
  const Icon = icons[type];
  
  return (
    <a 
      href={url} 
      target="_blank" 
      rel="noopener noreferrer"
      className={styles.socialLink}
      aria-label={type}
    >
      <Icon size={16} />
    </a>
  );
};

const TeamMember = ({ member }) => {
  return (
    <div className={styles.teamMember}>
      <div className={styles.memberImage}>
        {member.image ? (
          <img 
            src={member.image} 
            alt={member.name}
            className={styles.avatar} 
          />
        ) : (
          <div className={styles.avatarPlaceholder}>
            {member.name.split(' ').map(n => n[0]).join('')}
          </div>
        )}
      </div>
      <div className={styles.memberInfo}>
        <div className={styles.memberHeader}>
          <div>
            <h4 className={styles.memberName}>{member.name}</h4>
            <p className={styles.memberRole}>{member.role}</p>
          </div>
          {member.socials && (
            <div className={styles.socialLinks}>
              {Object.entries(member.socials).map(([type, url]) => (
                <SocialLink key={type} type={type} url={url} />
              ))}
            </div>
          )}
        </div>
        {member.bio && (
          <p className={styles.memberBio}>{member.bio}</p>
        )}
      </div>
    </div>
  );
};

const DetailedProjectView = ({ project }) => {
  return (
    <div className={styles.detailedView}>
      <div className={styles.mainContent}>
        {/* Overview Section */}
        <Section title="Project Overview" icon={FileText}>
          <div className={styles.fullDescription}>
            {project.fullDescription.split('\n\n').map((paragraph, index) => (
              <p key={index} className={styles.paragraph}>
                {paragraph}
              </p>
            ))}
          </div>
        </Section>


        {/* Working Style Section */}
        {project.workingStyle && (
          <Section title="Approach & Methodology" icon={BookOpen}>
            <div className={styles.workingStyle}>
              {project.workingStyle}
            </div>
          </Section>
        )}

        {/* Deliverables Section */}
        {project.deliverables && (
          <Section title="Key Deliverables" icon={Target}>
            <ul className={styles.deliverablesList}>
              {project.deliverables.map((deliverable, index) => (
                <li key={index}>{deliverable}</li>
              ))}
            </ul>
          </Section>
        )}

        {/* Team Section */}
        {project.team && project.team.length > 0 && (
          <Section title="Research Team" icon={Users}>
            <div className={styles.teamGrid}>
              {project.team.map((member, index) => (
                <TeamMember key={index} member={member} />
              ))}
            </div>
          </Section>
        )}

        {/* Resources Section */}
        {project.resources && project.resources.length > 0 && (
          <Section title="Resources & Links" icon={Briefcase}>
            <div className={styles.resourceLinks}>
              {project.resources.map((resource, index) => (
                <a 
                  key={index}
                  href={resource.url}
                  className={styles.resourceLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {resource.icon && (
                    <span className={styles.resourceIcon}>
                      {typeof resource.icon === 'string' ? (
                        <Icon name={resource.icon} size={16} />
                      ) : (
                        <resource.icon size={16} />
                      )}
                    </span>
                  )}
                  <span>{resource.title}</span>
                </a>
              ))}
            </div>
          </Section>
        )}
      </div>
    </div>
  );
};

export default DetailedProjectView;
