// src/components/Research/ResearchList.js
import React, { useState } from 'react';
import styles from './ResearchList.module.css';
import ResearchCard from './ResearchCard';
import { Filter, Search } from 'lucide-react';

export default function ResearchList({ papers, researchAreas }) {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('progress'); // 'progress', 'date', 'title'

  // Filter papers based on research area and search term
  const filteredPapers = papers.filter(paper => {
    const matchesFilter = filter === 'all' || paper.researchArea.toLowerCase().replace(/[^a-z]/g, '-') === filter;
    const matchesSearch = searchTerm === '' || 
      paper.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      paper.abstract.toLowerCase().includes(searchTerm.toLowerCase()) ||
      paper.authors.some(author => author.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesFilter && matchesSearch;
  });

  // Sort papers
  const sortedPapers = [...filteredPapers].sort((a, b) => {
    switch (sortBy) {
      case 'progress':
        // Sort by current progress (active stage progress)
        const aProgress = a.progressStages.find(stage => stage.status === 'active')?.progress || 0;
        const bProgress = b.progressStages.find(stage => stage.status === 'active')?.progress || 0;
        return bProgress - aProgress;
      case 'date':
        return new Date(b.startDate) - new Date(a.startDate);
      case 'title':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {/* Filters and Search */}
        <div className={styles.controls}>
          <div className={styles.searchContainer}>
            <Search size={20} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search papers, authors, or keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>
          
          <div className={styles.filterContainer}>
            <Filter size={20} className={styles.filterIcon} />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="all">All Areas</option>
              {researchAreas.map(area => (
                <option key={area.id} value={area.id}>
                  {area.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className={styles.sortContainer}>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={styles.sortSelect}
            >
              <option value="progress">Sort by Progress</option>
              <option value="date">Sort by Date</option>
              <option value="title">Sort by Title</option>
            </select>
          </div>
        </div>

        {/* Results count */}
        <div className={styles.resultsInfo}>
          <span className={styles.resultsCount}>
            {sortedPapers.length} {sortedPapers.length === 1 ? 'paper' : 'papers'}
            {filter !== 'all' && ` in ${researchAreas.find(area => area.id === filter)?.name}`}
            {searchTerm && ` matching "${searchTerm}"`}
          </span>
        </div>

        {/* Papers Grid */}
        <div className={styles.papersGrid}>
          {sortedPapers.map((paper, index) => (
            <ResearchCard 
              key={paper.id} 
              paper={paper} 
              researchAreas={researchAreas}
              index={index}
            />
          ))}
        </div>

        {/* Empty state */}
        {sortedPapers.length === 0 && (
          <div className={styles.emptyState}>
            <h3>No papers found</h3>
            <p>Try adjusting your search terms or filters.</p>
            <button 
              onClick={() => {
                setSearchTerm('');
                setFilter('all');
              }}
              className={styles.clearFiltersButton}
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
