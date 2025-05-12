#!/usr/bin/env python3
"""
Module for finding and copying audio files for blog posts.
Updated to copy files to the static directory for better compatibility with Docusaurus.
"""
import os
import shutil
from pathlib import Path
from typing import Optional, Tuple

def find_audio_file(source_dir: Path, slug: str, logger=None) -> Optional[Path]:
    """
    Find an audio file matching the current blog post
    
    Args:
        source_dir: Source directory to search in
        slug: Blog post slug to match
        logger: Logger instance
        
    Returns:
        Path to found audio file or None
    """
    log = logger or __import__('logging').getLogger(__name__)
    
    log.debug(f"Searching for audio files in: {source_dir}")
    if not source_dir.exists():
        log.warning(f"Source directory does not exist: {source_dir}")
        return None
        
    # List all files in the directory for debugging
    all_files = list(source_dir.glob("*"))
    log.debug(f"Files in directory: {[f.name for f in all_files]}")
    
    # Try to find audio files with common formats
    audio_extensions = ['.mp3', '.wav', '.m4a', '.ogg']
    
    # Handle common variations and typos
    slug_variations = [
        slug,                           # Original slug (e.g., "toc-governance")
        slug.replace('-', '_'),         # Underscore version (e.g., "toc_governance")
        slug.replace('_', '-'),         # Hyphenated version (e.g., "toc-governance")
        slug.replace("governance", "govenance"),  # Common typo
        slug.replace("govenance", "governance"),  # Fix for common typo
    ]
    
    if slug.startswith("toc-") or slug.startswith("toc_"):
        # Add expanded version for TOC
        expanded = slug.replace("toc-", "theory-of-change-").replace("toc_", "theory_of_change_")
        slug_variations.append(expanded)
        slug_variations.append(expanded.replace('-', '_'))
        slug_variations.append(expanded.replace("governance", "govenance"))
        slug_variations.append(expanded.replace("govenance", "governance"))
    
    log.debug(f"Trying slug variations: {slug_variations}")
    
    # First try exact matches
    for slug_var in slug_variations:
        for ext in audio_extensions:
            audio_path = source_dir / f"{slug_var}{ext}"
            if audio_path.exists():
                log.debug(f"Found exact match: {audio_path}")
                return audio_path
    
    # Now try partial matches with any audio file
    audio_files = []
    for ext in audio_extensions:
        audio_files.extend(list(source_dir.glob(f"*{ext}")))
    
    log.debug(f"Found {len(audio_files)} audio files: {[f.name for f in audio_files]}")
    
    # Check each audio file against our slug variations
    for audio_file in audio_files:
        filename_lower = audio_file.name.lower()
        for slug_var in slug_variations:
            # Remove all hyphens/underscores for more flexible matching
            clean_slug = slug_var.lower().replace('-', '').replace('_', '')
            clean_filename = filename_lower.replace('-', '').replace('_', '')
            
            if clean_slug in clean_filename:
                log.debug(f"Found partial match: {audio_file}")
                return audio_file
            
            # Special case for "govern" stem
            if "govern" in slug_var.lower() and "govern" in filename_lower:
                log.debug(f"Found 'govern' keyword match: {audio_file}")
                return audio_file
    
    # Look for broader pattern matches like "theory of change" + "governance" concepts
    if "governance" in slug.lower() or "govenance" in slug.lower():
        for audio_file in audio_files:
            filename_lower = audio_file.name.lower()
            if ("theory" in filename_lower or "toc" in filename_lower) and ("govern" in filename_lower):
                log.debug(f"Found concept match (theory + governance): {audio_file}")
                return audio_file
    
    log.debug(f"No matching audio file found for slug: {slug}")
    return None

def copy_audio_file(audio_path: Path, target_dir: Path, static_dir: Path = None) -> Tuple[Path, Path]:
    """
    Copy audio file to both the blog post directory AND the static/audio directory
    
    Args:
        audio_path: Path to the source audio file
        target_dir: Path to the blog post directory
        static_dir: Path to the project's static directory (if None, will use target_dir.parents[1] / 'static')
    
    Returns:
        Tuple of (Path to blog post audio file, Path to static audio file)
    """
    # Ensure target directories exist
    target_dir.mkdir(parents=True, exist_ok=True)
    
    # Determine static directory if not provided
    if static_dir is None:
        # Try to find the static directory by looking up from target_dir
        # Assuming target_dir is blog/slug/
        static_dir = target_dir.parents[1] / 'static'
    
    # Create audio directory in static if it doesn't exist
    static_audio_dir = static_dir / 'audio'
    static_audio_dir.mkdir(parents=True, exist_ok=True)
    
    # Convert .wav files to .mp3 for better web compatibility
    if audio_path.suffix.lower() == '.wav':
        # Use a .mp3 extension for the destination
        post_dest_path = target_dir / f"{audio_path.stem}.mp3"
        static_dest_path = static_audio_dir / f"{audio_path.stem}.mp3"
        
        # Just copy for now - in a real implementation you might convert using a library
        shutil.copy2(audio_path, post_dest_path)
        shutil.copy2(audio_path, static_dest_path)
    else:
        post_dest_path = target_dir / audio_path.name
        static_dest_path = static_audio_dir / audio_path.name
        
        shutil.copy2(audio_path, post_dest_path)
        shutil.copy2(audio_path, static_dest_path)
        
    return post_dest_path, static_dest_path

def process(content: str, source_dir: Path, post_dir: Path, slug: str, title=None, logger=None) -> Tuple[str, Optional[Path]]:
    """
    Process audio file for blog post and add player component
    
    Args:
        content: Blog post content
        source_dir: Source directory to search for audio files
        post_dir: Target blog post directory
        slug: Blog post slug
        title: Post title for audio component
        logger: Logger instance
        
    Returns:
        Tuple of (updated content, path to audio file or None)
    """
    log = logger or __import__('logging').getLogger(__name__)
    
    # Find audio file
    log.info(f"Searching for audio file for '{slug}'")
    audio_path = find_audio_file(source_dir, slug, logger=log)
    
    if not audio_path:
        log.info(f"No audio file found for '{slug}'")
        return content, None
    
    log.info(f"Found audio file: {audio_path}")
    
    # Copy audio file to post directory and static directory
    post_copied_path, static_copied_path = copy_audio_file(audio_path, post_dir)
    log.info(f"Copied audio file to blog post: {post_copied_path}")
    log.info(f"Copied audio file to static directory: {static_copied_path}")
    
    # Get relative path for static file (e.g., /audio/filename.mp3)
    static_relative_path = f"/audio/{static_copied_path.name}"
    
    # Add audio player component after frontmatter
    log.info("Adding AudioPlayer component to blog post")
    
    # Find where to insert the component (after frontmatter)
    frontmatter_end = content.find("---\n\n")
    if frontmatter_end != -1:
        # Insert after frontmatter
        frontmatter_end += 4  # Length of "---\n\n"
        
        # AudioPlayer component code
        post_title = title or "this post"
        
        audio_component = f"""import AudioPlayer from '@site/src/components/AudioPlayer';

<AudioPlayer audioSrc="{static_relative_path}" title="{post_title}" />

"""
        # Insert into content
        updated_content = content[:frontmatter_end] + audio_component + content[frontmatter_end:]
    else:
        # Fallback if frontmatter not found
        log.warning("Frontmatter not found, adding component at the beginning")
        updated_content = f"""import AudioPlayer from '@site/src/components/AudioPlayer';

<AudioPlayer audioSrc="{static_relative_path}" title="{title or slug}" />

{content}"""
    
    return updated_content, post_copied_path

if __name__ == "__main__":
    # Test functionality
    import sys
    if len(sys.argv) != 4:
        print("Usage: python process_audio.py <source_dir> <output_dir> <slug>")
        sys.exit(1)
    
    source_dir = Path(sys.argv[1])
    output_dir = Path(sys.argv[2])
    slug = sys.argv[3]
    
    # For testing - use empty content
    content = ""
    
    _, audio_path = process(content, source_dir, output_dir, slug)
    
    if audio_path:
        print(f"Audio file copied to: {audio_path}")
    else:
        print("No audio file found")
