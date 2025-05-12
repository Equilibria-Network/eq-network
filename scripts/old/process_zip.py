#!/usr/bin/env python3
"""
Module for extracting zip files and finding markdown files from Notion exports.
Combines functionality from extract_zip.py and find_markdown.py.
"""
import os
import zipfile
import shutil
from pathlib import Path
from typing import Tuple

def extract_zip(zip_path: Path) -> Path:
    """
    Extract a zip file to a directory named after the zip file
    
    Args:
        zip_path: Path object to the zip file
    
    Returns:
        Path object to the extracted directory
    """
    # Create extraction directory based on zip filename
    extract_dir = zip_path.parent / zip_path.stem
    
    # Remove existing directory if it exists
    if extract_dir.exists():
        shutil.rmtree(extract_dir)
    
    extract_dir.mkdir(parents=True, exist_ok=True)
    
    # Extract the zip file
    try:
        with zipfile.ZipFile(zip_path, 'r') as zip_ref:
            zip_ref.extractall(extract_dir)
        return extract_dir
    except zipfile.BadZipFile:
        raise ValueError(f"Error: {zip_path} is not a valid zip file")
    except Exception as e:
        raise ValueError(f"Error extracting {zip_path}: {e}")

def find_markdown(directory: Path) -> Path:
    """
    Find the main markdown file in a Notion export directory
    
    Args:
        directory: Path object to the directory
    
    Returns:
        Path object to the found markdown file
    """
    directory = Path(directory)
    
    # If directory doesn't exist, raise error
    if not directory.exists():
        raise FileNotFoundError(f"Directory not found: {directory}")
    
    # Search strategies in order of preference
    
    # Strategy 1: Look for markdown files in the root
    root_md_files = list(directory.glob("*.md"))
    if root_md_files:
        return root_md_files[0]
    
    # Strategy 2: Look for "Private & Shared" directory (common in Notion exports)
    private_shared = directory / "Private & Shared"
    if private_shared.exists() and private_shared.is_dir():
        ps_files = list(private_shared.glob("*.md"))
        if ps_files:
            return ps_files[0]
    
    # Strategy 3: Search recursively, but skip node_modules and other common dirs to avoid
    for root, dirs, files in os.walk(directory):
        # Skip node_modules and other common dirs to avoid
        dirs[:] = [d for d in dirs if d not in {'node_modules', '.git', 'dist', 'build'}]
        
        for file in files:
            if file.endswith('.md'):
                return Path(root) / file
    
    # If no markdown file found, raise error
    raise FileNotFoundError(f"No markdown file found in {directory}")

def process(source_path: Path, skip_extract: bool = False, logger=None) -> Tuple[Path, Path]:
    """
    Process zip/directory and find markdown file
    
    Args:
        source_path: Path to zip file or directory
        skip_extract: Whether to skip extraction if source is a zip
    
    Returns:
        Tuple of (markdown file path, extract directory path)
    """
    log = logger or __import__('logging').getLogger(__name__)

    # If source is a zip file, extract it unless skip_extract is True
    if source_path.is_file() and source_path.suffix.lower() == '.zip' and not skip_extract:
        log.info(f"Extracting zip file: {source_path}")
        extract_dir = extract_zip(source_path)
        log.debug(f"Extracted to: {extract_dir}")
    else:
        # If it's a directory or extraction is skipped, use the source
        extract_dir = source_path if source_path.is_dir() else source_path.parent
        log.info(f"Using directory: {extract_dir}")
    
    # Find markdown file in the extracted content
    log.info("Searching for markdown file...")
    markdown_path = find_markdown(extract_dir)
    log.info(f"Found markdown file: {markdown_path}")
    return markdown_path, extract_dir

if __name__ == "__main__":
    # Test functionality
    import sys
    if len(sys.argv) != 2:
        print("Usage: python process_zip.py <path_to_zip_or_directory>")
        sys.exit(1)
    
    md_path, extract_dir = process(Path(sys.argv[1]))
    print(f"Found markdown file: {md_path}")
    print(f"In directory: {extract_dir}")
