#!/bin/bash
# Setup and normalize committee photos

echo "=========================================="
echo "Committee Photo Normalization Setup"
echo "=========================================="
echo ""

# Check if Python is available
if ! command -v python3 &> /dev/null; then
    echo "Error: Python 3 is required but not installed."
    echo "Please install Python 3.8+ and try again."
    exit 1
fi

# Install required packages
echo "Installing required packages..."
pip install --quiet opencv-python pillow numpy

if [ $? -ne 0 ]; then
    echo "Error: Failed to install dependencies"
    exit 1
fi

echo "Dependencies installed successfully!"
echo ""
echo "Running photo normalization..."
python3 normalize_photos.py

echo ""
echo "Next steps:"
echo "1. Review normalized images in img_normalized/ directory"
echo "2. Update HTML files to use normalized images"
echo "3. Test pages in browser to verify consistency"
