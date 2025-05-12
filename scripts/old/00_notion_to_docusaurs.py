#!/usr/bin/env python3
"""
Main orchestration script for converting Notion exports to Docusaurus blog posts.
This script coordinates the pipeline but delegates actual processing to specialized modules.
"""
import sys
import argparse
import logging
from pathlib import Path
from datetime import datetime

# Import processing modules
import process_zip
import process_metadata
import process_images
import process_audio
import process_output
from notion_logger import setup_logger, write_debug_file

def parse_args():
    """Parse command line arguments"""
    parser = argparse.ArgumentParser(
        description='Convert Notion-exported content to Docusaurus blog posts'
    )
    parser.add_argument('source', help='Path to the Notion export zip file or directory')
    parser.add_argument('--output-dir', '-o', default='./blog', 
                      help='Output directory (default: ./blog)')
    parser.add_argument('--debug-dir', '-d', default='./debug', 
                      help='Directory for debug files (default: ./debug)')
    parser.add_argument('--skip-extract', action='store_true',
                      help='Skip zip extraction (use when already extracted)')
    parser.add_argument('--skip-images', action='store_true',
                      help='Skip image processing')
    parser.add_argument('--skip-frontmatter', action='store_true',
                      help='Skip frontmatter generation')
    parser.add_argument('--verbose', '-v', action='store_true',
                      help='Enable verbose logging')
    return parser.parse_args()

def find_blog_dir():
    """Find the blog directory in the project"""
    # Find the project root (looking for the blog directory)
    script_dir = Path(__file__).parent.absolute()
    project_root = script_dir
    
    # Walk up to find the project root (where blog dir should be)
    while not (project_root / 'blog').exists() and project_root != project_root.parent:
        project_root = project_root.parent
    
    return project_root / 'blog'

def main():
    """Main orchestration function"""
    args = parse_args()
    
    # Setup logging
    log_level = logging.DEBUG if args.verbose else logging.INFO
    logger = setup_logger("notion2docusaurus", log_level=log_level)
    logger.info("Starting Notion to Docusaurus conversion process")
    
    source_path = Path(args.source)
    logger.info(f"Source: {source_path}")
    
    # Determine output directory
    if args.output_dir == './blog':  # Default value
        output_dir = find_blog_dir()
    else:
        output_dir = Path(args.output_dir)
    
    logger.info(f"Using blog directory: {output_dir}")
    output_dir.mkdir(parents=True, exist_ok=True)
    
    # Setup debug directory
    debug_dir = Path(args.debug_dir)
    debug_dir.mkdir(parents=True, exist_ok=True)
    logger.debug(f"Debug files will be written to: {debug_dir}")
    
    # Generate a run ID for this execution
    run_id = datetime.now().strftime('%Y%m%d_%H%M%S')
    process_debug_dir = debug_dir / run_id
    process_debug_dir.mkdir(parents=True, exist_ok=True)
    
    # Step 1: Extract zip and find markdown
    logger.info("Step 1: Extracting content and finding markdown file")
    if args.skip_extract and source_path.is_file() and source_path.suffix.lower() == '.md':
        # User provided a direct markdown file
        markdown_path = source_path
        extract_dir = source_path.parent
        logger.info(f"Using provided markdown file: {markdown_path}")
    else:
        # Process zip and find markdown
        markdown_path, extract_dir = process_zip.process(
            source_path, 
            skip_extract=args.skip_extract,
            logger=logger
        )
    
    # Read the markdown content
    with open(markdown_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Write debug file after extraction
    debug_file = write_debug_file(content, process_debug_dir, "01_extracted")
    logger.debug(f"Extracted content written to: {debug_file}")
    
    # Step 2: Process metadata and create frontmatter
    logger.info("Step 2: Processing metadata and creating frontmatter")
    if args.skip_frontmatter:
        # Skip metadata processing
        metadata = None
        logger.info("Skipping frontmatter generation")
    else:
        content, metadata = process_metadata.process(content, output_dir, logger=logger)
        logger.info(f"Processed metadata for: {metadata.title}")
    
    # Write debug file after metadata processing
    debug_file = write_debug_file(content, process_debug_dir, "02_metadata")
    logger.debug(f"Content after metadata processing written to: {debug_file}")
    
    # Create slug-based output directory
    slug = metadata.slug if metadata else Path(markdown_path).stem
    post_dir = output_dir / slug
    post_dir.mkdir(parents=True, exist_ok=True)
    logger.info(f"Creating post directory: {post_dir}")
    
    # Step 3: Process images if needed
    logger.info("Step 3: Processing images")
    if args.skip_images:
        logger.info("Skipping image processing")
    else:
        content, image_paths = process_images.process(
            content,
            extract_dir,
            post_dir,
            logger=logger
        )
        logger.info(f"Processed {len(image_paths)} images")
    
    # Write debug file after image processing
    debug_file = write_debug_file(content, process_debug_dir, "03_images")
    logger.debug(f"Content after image processing written to: {debug_file}")
    
    # Step 4: Process audio if available
    logger.info("Step 4: Processing audio")
    # Search in both the extracted directory and the source directory for audio files
    source_dir_for_audio = source_path.parent if source_path.is_file() else source_path
    
    # Enable verbose logging for this critical section
    logger.debug(f"Extracted dir: {extract_dir}")
    logger.debug(f"Source dir for audio: {source_dir_for_audio}")
    logger.debug(f"Slug: {slug}")
    
    # Get post title for the audio component
    post_title = metadata.title if metadata else slug
    
    # Try the source directory first (where audio files are likely to be)
    content, audio_path = process_audio.process(
        content,
        source_dir_for_audio,
        post_dir,
        slug,
        title=post_title,
        logger=logger
    )
    
    # If not found, try the extracted directory
    if not audio_path:
        content, audio_path = process_audio.process(
            content,
            extract_dir,
            post_dir,
            slug,
            title=post_title,
            logger=logger
        )
    
    if audio_path:
        logger.info(f"Added audio player component for file: {audio_path}")
    else:
        logger.info("No audio file found")
    
    # Write debug file after audio processing
    debug_file = write_debug_file(content, process_debug_dir, "04_audio")
    logger.debug(f"Content after audio processing written to: {debug_file}")
    
    # Step 5: Write final output
    logger.info("Step 5: Writing final output")
    output_path = process_output.write(content, post_dir, logger=logger)
    logger.info(f"✅ Blog post created at {output_path}")
    
    # Write final debug file
    debug_file = write_debug_file(content, process_debug_dir, "05_final")
    logger.debug(f"Final content written to: {debug_file}")
    
    logger.info("Conversion process completed successfully")

if __name__ == "__main__":
    main()
