#!/usr/bin/env python3
"""
Module for extracting metadata from markdown and generating frontmatter.
Combines functionality from extract_metadata.py and add_frontmatter.py.
"""
import re
from pathlib import Path
from datetime import datetime
from typing import List, Optional, Dict, NamedTuple, Tuple

class BlogMetadata(NamedTuple):
    """Store metadata for a blog post"""
    title: str
    slug: str
    authors: List[str]
    tags: List[str]
    date: str
    description: Optional[str] = None
    image: Optional[str] = None

def extract_title_from_content(content: str) -> str:
    """Extract title from the content (first h1)"""
    match = re.search(r'^#\s+(.+?)(?:\s*\n|$)', content, re.MULTILINE)
    if match:
        return match.group(1).strip()
    return "Untitled Post"

def generate_slug(title: str) -> str:
    """Generate a URL slug from the title"""
    # Remove special chars, replace spaces with hyphens, convert to lowercase
    slug = re.sub(r'[^\w\s-]', '', title.lower())
    slug = re.sub(r'[\s_-]+', '-', slug)
    slug = re.sub(r'^-+|-+$', '', slug)
    return slug

def extract_metadata_tags(content: str) -> Dict:
    """Extract metadata from <metadata> tags in the content"""
    pattern = r'<metadata>(.*?)</metadata>'
    match = re.search(pattern, content, flags=re.DOTALL)
    
    if not match:
        return {}
    
    metadata_text = match.group(1)
    metadata = {}
    
    # Extract key-value pairs
    for line in metadata_text.strip().split('\n'):
        if ':' in line:
            key, value = line.split(':', 1)
            metadata[key.strip()] = value.strip()
    
    return metadata

def extract_tags_from_content(content: str) -> List[str]:
    """
    Extract potential tags from content based on bold text and keywords
    This is a heuristic to help generate tags when none are explicitly provided
    """
    # Extract bold text as potential keywords
    bold_pattern = r'\*\*([^*]+)\*\*'
    bold_matches = re.findall(bold_pattern, content)
    
    # Create potential tags from the most common technical terms in bold text
    potential_tags = []
    for match in bold_matches:
        # Only consider longer phrases that might be meaningful concepts
        if len(match.split()) > 1 and len(match) > 10:
            # Convert to kebab-case for tag format
            tag = match.lower().replace(' ', '-')
            # Clean up any non-alphanumeric chars except hyphens
            tag = re.sub(r'[^\w-]', '', tag)
            potential_tags.append(tag)
    
    # Return up to 3 unique tags
    return list(set(potential_tags))[:3]

def extract_metadata(content: str) -> BlogMetadata:
    """
    Extract metadata from content
    
    Args:
        content: String containing the markdown content
    
    Returns:
        BlogMetadata object with extracted info
    """
    # Get explicit metadata from tags if present
    metadata_dict = extract_metadata_tags(content)
    
    # Extract title (from metadata or first h1)
    title = metadata_dict.get('Post Name', None) or extract_title_from_content(content)
    
    # Generate slug from title
    slug = metadata_dict.get('Slug', None) or generate_slug(title)
    
    # Get authors (default to equilibria if not specified)
    authors_raw = metadata_dict.get('Authors', 'equilibria')
    authors = [a.strip() for a in authors_raw.split(',')]
    
    # Get tags (from metadata or try to extract from content)
    tags_raw = metadata_dict.get('Tags', '')
    tags = [t.strip() for t in tags_raw.split(',')] if tags_raw else extract_tags_from_content(content)
    
    # Get date (default to today if not specified)
    date = metadata_dict.get('Date', datetime.now().strftime('%Y-%m-%d'))
    
    # Get description (optional)
    description = metadata_dict.get('Description', None)
    
    # Get image (optional)
    image = metadata_dict.get('Image', None)
    
    return BlogMetadata(
        title=title,
        slug=slug,
        authors=authors,
        tags=tags,
        date=date,
        description=description,
        image=image
    )

def generate_frontmatter(metadata: BlogMetadata) -> str:
    """
    Generate frontmatter for Docusaurus blog post
    
    Args:
        metadata: BlogMetadata object
    
    Returns:
        String with frontmatter content
    """
    fm = ["---"]
    
    # Required fields
    fm.append(f"slug: {metadata.slug}")
    fm.append(f"title: '{metadata.title}'")
    
    # Authors
    if metadata.authors and len(metadata.authors) == 1:
        fm.append(f"authors: [{metadata.authors[0]}]")
    elif metadata.authors:
        fm.append(f"authors: [{', '.join(metadata.authors)}]")
    
    # Tags
    if metadata.tags:
        clean_tags = [tag for tag in metadata.tags if tag]
        if clean_tags:
            fm.append(f"tags: [{', '.join(clean_tags)}]")
    
    # Optional fields
    if metadata.date:
        fm.append(f"date: '{metadata.date}'")
    
    if metadata.description:
        fm.append(f"description: '{metadata.description}'")
    
    if metadata.image:
        fm.append(f"image: {metadata.image}")
    
    fm.append("---")
    return "\n".join(fm)

def create_authors_file(blog_dir: Path, authors: list):
    """
    Create authors.yml file if it doesn't exist
    
    Args:
        blog_dir: Blog directory
        authors: List of authors
    """
    # In Docusaurus v3, authors file is expected at blog/authors.yml (no leading dot)
    authors_file = blog_dir / 'authors.yml'
    
    # Check if file exists and read existing content
    existing_authors = {}
    if authors_file.exists():
        try:
            with open(authors_file, 'r') as f:
                content = f.read()
                import yaml
                existing_authors = yaml.safe_load(content) or {}
        except:
            # If parsing fails, start fresh
            pass
    
    # Add new authors if not present
    modified = False
    for author in authors:
        if author and author not in existing_authors:
            existing_authors[author] = {
                'name': author.title(),
                'title': 'Researcher',
                'url': 'https://eq-network.org',
                'image_url': '/authors/placeholder.jpg'  # Use the placeholder image
            }
            modified = True
    
    # Write back if modified
    if modified:
        try:
            import yaml
            with open(authors_file, 'w') as f:
                yaml.dump(existing_authors, f, default_flow_style=False)
        except ImportError:
            # Fallback if yaml not available
            with open(authors_file, 'w') as f:
                for author, details in existing_authors.items():
                    f.write(f"{author}:\n")
                    for key, value in details.items():
                        f.write(f"  {key}: {value}\n")
    
    print(f"Created/updated authors file at {authors_file}")

def remove_metadata_tags(content: str) -> str:
    """
    Remove <metadata> tags from content
    
    Args:
        content: Markdown content with metadata tags
    
    Returns:
        Cleaned content without metadata tags
    """
    return re.sub(r'<metadata>.*?</metadata>', '', content, flags=re.DOTALL)

def add_frontmatter(content: str, metadata: BlogMetadata) -> str:
    """
    Add frontmatter to content
    
    Args:
        content: Markdown content
        metadata: BlogMetadata object
    
    Returns:
        Content with frontmatter added
    """
    # Remove metadata tags if present
    clean_content = remove_metadata_tags(content)
    
    # Remove first h1 title since it will be in the frontmatter
    title_pattern = rf'^#\s+{re.escape(metadata.title)}(?:\s*\n|$)'
    clean_content = re.sub(title_pattern, '', clean_content, count=1, flags=re.MULTILINE)
    
    # Generate frontmatter
    frontmatter = generate_frontmatter(metadata)
    
    # Add frontmatter to top of content
    final_content = f"{frontmatter}\n\n{clean_content.strip()}"
    
    return final_content

def process(content: str, blog_dir: Path, logger=None) -> Tuple[str, BlogMetadata]:
    """
    Process metadata: extract info and add frontmatter
    
    Args:
        content: Markdown content
        blog_dir: Blog directory for authors.yml
        logger: Logger instance
        
    Returns:
        Tuple of (content with frontmatter, metadata object)
    """
    log = logger or __import__('logging').getLogger(__name__)
    
    # Extract metadata
    log.info("Extracting metadata from content")
    metadata = extract_metadata(content)
    log.info(f"Extracted title: {metadata.title}")
    log.debug(f"Generated slug: {metadata.slug}")
    log.debug(f"Authors: {', '.join(metadata.authors)}")
    log.debug(f"Tags: {', '.join(metadata.tags) if metadata.tags else 'None'}")
    
    # Create/update authors file
    log.info("Creating/updating authors file")
    create_authors_file(blog_dir, metadata.authors)
    
    # Add frontmatter to content
    log.info("Adding frontmatter to content")
    final_content = add_frontmatter(content, metadata)
    
    return final_content, metadata

if __name__ == "__main__":
    # Test functionality
    import sys
    if len(sys.argv) != 3:
        print("Usage: python process_metadata.py <markdown_file> <blog_directory>")
        sys.exit(1)
    
    md_path = Path(sys.argv[1])
    blog_dir = Path(sys.argv[2])
    
    with open(md_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    processed_content, metadata = process(content, blog_dir)
    print(f"Processed metadata for: {metadata.title}")
    print(f"First 500 characters of processed content:")
    print(processed_content[:500] + "...")
