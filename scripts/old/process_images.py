#!/usr/bin/env python3
"""
Module for processing images in Notion-exported markdown
"""
import re
import os
import shutil
import requests
from pathlib import Path
from typing import List, Tuple, Optional
from urllib.parse import urlparse

def is_url(text: str) -> bool:
    """Check if a string is a URL"""
    try:
        result = urlparse(text)
        return all([result.scheme, result.netloc])
    except:
        return False

def download_image(url: str, images_dir: Path) -> Optional[Path]:
    """
    Download an image from a URL to the images directory
    
    Args:
        url: URL of the image
        images_dir: Path to the directory to save the image
    
    Returns:
        Path to the saved image, or None if download failed
    """
    # Create images directory if it doesn't exist
    images_dir.mkdir(parents=True, exist_ok=True)
    
    # Generate filename from URL
    path_parts = urlparse(url).path.split('/')
    filename = path_parts[-1] if path_parts[-1] else f"image_{abs(hash(url)) % 10000}.jpg"
    
    # Download image
    try:
        response = requests.get(url, stream=True)
        response.raise_for_status()
        
        image_path = images_dir / filename
        with open(image_path, 'wb') as out_file:
            shutil.copyfileobj(response.raw, out_file)
        
        return image_path
    except Exception as e:
        print(f"Error downloading image {url}: {e}")
        return None

def find_local_image(img_url: str, source_dir: Path) -> Optional[Path]:
    """
    Find a local image referenced in the markdown
    
    Args:
        img_url: URL or path to the image
        source_dir: Base directory to search from
    
    Returns:
        Path to the found image, or None if not found
    """
    # First, check if the path exists as-is
    img_path = Path(img_url)
    if img_path.exists():
        return img_path
    
    # Check relative to source directory
    source_img_path = source_dir / img_url
    if source_img_path.exists():
        return source_img_path
    
    # Look in common Notion export locations
    potential_paths = [
        source_dir / "Images" / Path(img_url).name,
        source_dir / "images" / Path(img_url).name,
        source_dir / "assets" / Path(img_url).name,
    ]
    
    # Check for images directory in parent directories
    for parent in source_dir.parents:
        potential_paths.append(parent / "Images" / Path(img_url).name)
        potential_paths.append(parent / "images" / Path(img_url).name)
    
    # Search for image files with the same base name
    for path in potential_paths:
        if path.exists():
            return path
    
    # Try to find by searching for image files
    img_name = Path(img_url).name
    for ext in ['.png', '.jpg', '.jpeg', '.gif', '.svg']:
        for img_file in source_dir.glob(f"**/*{ext}"):
            if img_file.name.lower() == img_name.lower() or img_file.stem.lower() == Path(img_url).stem.lower():
                return img_file
    
    return None

def copy_image(src_path: Path, images_dir: Path) -> Path:
    """
    Copy an image to the target directory
    
    Args:
        src_path: Source image path
        images_dir: Target directory
    
    Returns:
        Path to the copied image
    """
    images_dir.mkdir(parents=True, exist_ok=True)
    dest_path = images_dir / src_path.name
    shutil.copy2(src_path, dest_path)
    return dest_path

def download_placeholder(images_dir: Path, img_name: str, index: int) -> Optional[Path]:
    """Download a simple gray placeholder image"""
    # Create a plain gray box
    placeholder_url = "https://placehold.co/600x400/CCCCCC/CCCCCC.png"
    
    try:
        # Download placeholder
        response = requests.get(placeholder_url, stream=True)
        response.raise_for_status()
        
        img_path = images_dir / img_name
        with open(img_path, 'wb') as out_file:
            shutil.copyfileobj(response.raw, out_file)
        
        return img_path
    except Exception as e:
        print(f"Warning: Could not download placeholder: {e}")
        return None

def process(content: str, source_dir: Path, post_dir: Path, logger=None) -> Tuple[str, List[Path]]:
    """
    Process images in the content, download/copy and update references
    
    Args:
        content: Markdown content
        source_dir: Source directory with original content
        post_dir: Post directory where content will be saved
    
    Returns:
        Tuple of (updated content, list of processed image paths)
    """
    log = logger or __import__('logging').getLogger(__name__)
    
    # Create images directory within the post directory
    images_dir = post_dir / "img"
    images_dir.mkdir(parents=True, exist_ok=True)
    processed_images = []
    
    log.info(f"Processing images in content, saving to {images_dir}")
    
    # First, look for Notion's Google doc images format
    google_doc_pattern = r'\[\]\((https?://lh[0-9]+-rt\.googleusercontent\.com/docsz/[^)]+\))'
    
    def process_google_doc_images(match):
        img_url = match.group(1)
        img_name = f"image_{len(processed_images) + 1}.png"
        
        try:
            # Download the image with a Session to avoid redirect issues
            session = requests.Session()
            response = session.get(img_url, stream=True, timeout=30)
            response.raise_for_status()
            
            img_path = images_dir / img_name
            with open(img_path, 'wb') as out_file:
                shutil.copyfileobj(response.raw, out_file)
            
            processed_images.append(img_path)
            # Use relative path from the markdown file's perspective
            return f'![](./img/{img_name})'
        except Exception as e:
            log.warning(f"Could not download Google Docs image: {e}")
            # Use a placeholder image
            img_index = len(processed_images) + 1
            placeholder_path = download_placeholder(images_dir, img_name, img_index)
            if placeholder_path:
                processed_images.append(placeholder_path)
                return f'![](./img/{img_name})'
            else:
                return match.group(0)
    
    # Process Google Docs images first
    content = re.sub(google_doc_pattern, process_google_doc_images, content)
    
    # Pattern for Notion-exported image formats
    img_patterns = [
        # Markdown image: ![alt](url)
        (r'!\[(.*?)\]\((.*?)\)', r'!\[\1\](\2)'),
        
        # HTML image: <img src="url" />
        (r'<img.*?src=["\']([^"\']+)["\'].*?/?>', r'<img src="\1" />'),
        
        # Notion's weird format: [](url)
        (r'\[\]\((.*?)\)', r'![](\1)')
    ]
    
    # Process each image pattern
    for pattern, replacement_template in img_patterns:
        def replace_image(match):
            if len(match.groups()) == 1:  # Notion format or HTML
                img_url = match.group(1)
                alt_text = ""
            else:  # Markdown format
                alt_text = match.group(1)
                img_url = match.group(2)
            
            # Skip if already processed
            if img_url.startswith('./img/'):
                return match.group(0)
            
            # Generate a filename for the image
            img_name = f"image_{len(processed_images) + 1}.png"
            img_index = len(processed_images) + 1
            
            # Process image URL
            if is_url(img_url):
                # Download remote image
                try:
                    img_path = download_image(img_url, images_dir)
                    if img_path:
                        processed_images.append(img_path)
                        # Use relative path from the markdown file
                        new_path = f"./img/{img_path.name}"
                    else:
                        raise Exception("Download failed")
                except Exception as e:
                    log.warning(f"Could not download image {img_url}: {e}")
                    # Use a placeholder
                    placeholder_path = download_placeholder(images_dir, img_name, img_index)
                    if placeholder_path:
                        processed_images.append(placeholder_path)
                        new_path = f"./img/{img_name}"
                    else:
                        return match.group(0)
            else:
                # Handle local image
                img_path = find_local_image(img_url, source_dir)
                if img_path:
                    copied_path = copy_image(img_path, images_dir)
                    processed_images.append(copied_path)
                    new_path = f"./img/{copied_path.name}"
                else:
                    # If image not found, use placeholder
                    log.warning(f"Could not find local image {img_url}")
                    placeholder_path = download_placeholder(images_dir, img_name, img_index)
                    if placeholder_path:
                        processed_images.append(placeholder_path)
                        new_path = f"./img/{img_name}"
                    else:
                        return match.group(0)
            
            # Create replacement
            if len(match.groups()) == 1 and '<img' in match.group(0):  # HTML format
                return f'<img src="{new_path}" alt="{alt_text}" />'
            else:  # Markdown format
                return f'![{alt_text}]({new_path})'
        
        content = re.sub(pattern, replace_image, content)
    
    return content, processed_images

if __name__ == "__main__":
    # Test functionality
    import sys
    if len(sys.argv) != 3:
        print("Usage: python process_images.py <markdown_file> <output_dir>")
        sys.exit(1)
    
    md_file = Path(sys.argv[1])
    output_dir = Path(sys.argv[2])
    
    with open(md_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    source_dir = md_file.parent
    
    processed_content, image_paths = process(content, source_dir, output_dir)
    
    # Write updated content to a new file
    output_file = output_dir / f"{md_file.stem}-images-processed.md"
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(processed_content)
    
    print(f"Processed {len(image_paths)} images")
    print(f"Updated content written to {output_file}")
