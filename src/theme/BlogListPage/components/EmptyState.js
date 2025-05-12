// src/theme/BlogListPage/EmptyState.js
import React from 'react';
import { SearchIcon, RefreshCcwIcon } from 'lucide-react';

export default function EmptyState({ resetFilter }) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        <SearchIcon size={48} />
      </div>
      <h3 className="empty-state-title">No posts found in this category</h3>
      <p className="empty-state-description">
        We couldn't find any blog posts matching your selected filter.
      </p>
      <button 
        className="empty-state-button"
        onClick={resetFilter}
      >
        <RefreshCcwIcon size={16} />
        <span>Show all posts</span>
      </button>
    </div>
  );
}
