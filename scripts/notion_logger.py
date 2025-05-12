#!/usr/bin/env python3
"""
Logging utilities for the Notion to Docusaurus pipeline.
"""
import logging
import sys
from pathlib import Path
from datetime import datetime
from typing import Optional

# ANSI color codes for terminal output
COLORS = {
    'INFO': '\033[94m',  # Blue
    'DEBUG': '\033[96m', # Cyan
    'WARNING': '\033[93m', # Yellow
    'ERROR': '\033[91m', # Red
    'CRITICAL': '\033[91m\033[1m', # Bold Red
    'RESET': '\033[0m' # Reset color
}

class ColorFormatter(logging.Formatter):
    """Formatter that adds colors to log levels in terminal output"""
    
    def format(self, record):
        levelname = record.levelname
        if levelname in COLORS:
            record.levelname = f"{COLORS[levelname]}{levelname}{COLORS['RESET']}"
        return super().format(record)

def setup_logger(name: str, log_dir: Optional[Path] = None, log_level: str = "INFO") -> logging.Logger:
    """
    Setup a logger with consistent formatting
    
    Args:
        name: Name for the logger
        log_dir: Directory to save log files (optional)
        
    Returns:
        Configured logger
    """
    logger = logging.getLogger(name)
    # Set logger level based on parameter
    level_map = {
        "DEBUG": logging.DEBUG,
        "INFO": logging.INFO,
        "WARNING": logging.WARNING,
        "ERROR": logging.ERROR,
        "CRITICAL": logging.CRITICAL
    }
    logger_level = level_map.get(log_level, logging.INFO)
    logger.setLevel(logger_level)
    
    # Clear any existing handlers
    if logger.handlers:
        logger.handlers = []
    
    # Console handler with color formatting
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setLevel(logging.INFO)
    console_format = '%(levelname)s [%(name)s] %(message)s'
    console_handler.setFormatter(ColorFormatter(console_format))
    logger.addHandler(console_handler)
    
    # File handler if log_dir is provided
    if log_dir:
        log_dir.mkdir(parents=True, exist_ok=True)
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        log_file = log_dir / f"{name}_{timestamp}.log"
        file_handler = logging.FileHandler(log_file, encoding='utf-8')
        file_handler.setLevel(logging.DEBUG)
        file_format = '%(asctime)s [%(levelname)s] %(name)s: %(message)s'
        file_handler.setFormatter(logging.Formatter(file_format))
        logger.addHandler(file_handler)
    
    return logger

def write_debug_file(content: str, debug_dir: Path, prefix: str) -> Path:
    """
    Write content to a debug file for troubleshooting
    
    Args:
        content: Content to write
        debug_dir: Directory to save debug files
        prefix: Prefix for the debug file name
        
    Returns:
        Path to the created debug file
    """
    debug_dir.mkdir(parents=True, exist_ok=True)
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    debug_file = debug_dir / f"{prefix}_{timestamp}.md"
    
    with open(debug_file, 'w', encoding='utf-8') as f:
        f.write(f"<!-- Debug file created at {datetime.now().isoformat()} -->\n\n")
        f.write(content)
    
    return debug_file
