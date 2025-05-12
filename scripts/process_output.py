#!/usr/bin/env python3
"""
Module for writing the final processed content to the output directory.
"""
from pathlib import Path

def write(content: str, post_dir: Path, logger=None) -> Path:
    """
    Write the processed content to the output directory
    
    Args:
        content: Processed markdown content
        post_dir: Directory for the blog post
        logger: Logger instance
        
    Returns:
        Path to the created file
    """
    log = logger or __import__('logging').getLogger(__name__)
    
    # Ensure post directory exists
    post_dir.mkdir(parents=True, exist_ok=True)
    log.debug(f"Ensuring post directory exists: {post_dir}")
    
    # Create the index.md file in the post directory
    output_file = post_dir / 'index.md'
    log.info(f"Writing final content to: {output_file}")
    
    # Write content to file
    try:
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(content)
        log.debug(f"Successfully wrote {len(content)} characters to file")
    except Exception as e:
        log.error(f"Error writing to file: {e}")
        raise
    
    return output_file

if __name__ == "__main__":
    # Test functionality
    import sys
    if len(sys.argv) != 3:
        print("Usage: python process_output.py <content_file> <output_dir>")
        sys.exit(1)
    
    # Read content from file
    content_file = Path(sys.argv[1])
    with open(content_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Write to output directory
    output_dir = Path(sys.argv[2])
    output_path = write(content, output_dir)
    print(f"Content written to {output_path}")
