// src/theme/BlogListPage/PostCounter.js
import React from 'react';
import { FileTextIcon } from 'lucide-react';

export default function PostCounter({ count, total, category }) {
  return (
    <div className="post-counter">
      <div className="post-counter-icon">
        <FileTextIcon size={16} />
      </div>
      <span className="post-counter-text">
        {category === 'all' 
          ? `Showing all ${count} posts`
          : `Showing ${count} of ${total} posts in "${category}"`}
      </span>
    </div>
  );
}
