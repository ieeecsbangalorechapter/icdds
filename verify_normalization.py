#!/usr/bin/env python3
"""
Photo Normalization Verification Tool
Analyzes processed images to verify consistency and quality.
"""

import os
import cv2
from pathlib import Path
from PIL import Image

def verify_images(directory):
    """Verify all images in directory meet normalization standards."""
    
    print("=" * 70)
    print("Photo Normalization Verification Tool")
    print("=" * 70)
    print()
    
    if not os.path.exists(directory):
        print(f"Error: Directory '{directory}' not found")
        return False
    
    # Expected specifications
    EXPECTED_WIDTH = 220
    EXPECTED_HEIGHT = 280
    image_extensions = {'.jpg', '.jpeg', '.png', '.JPG', '.JPEG', '.PNG'}
    
    # Statistics
    total_images = 0
    correct_size = 0
    wrong_size = []
    unreadable = []
    
    print(f"Scanning directory: {directory}/\n")
    
    # Process all images
    for filename in sorted(os.listdir(directory)):
        file_path = os.path.join(directory, filename)
        
        if os.path.isfile(file_path) and Path(filename).suffix.lower() in image_extensions:
            total_images += 1
            
            try:
                # Open image and check dimensions
                img = Image.open(file_path)
                width, height = img.size
                
                # Verify dimensions
                if width == EXPECTED_WIDTH and height == EXPECTED_HEIGHT:
                    correct_size += 1
                    status = "✓ PASS"
                else:
                    wrong_size.append((filename, width, height))
                    status = "✗ FAIL"
                
                print(f"{status}  {filename:<35} {width}×{height}px", end="")
                
                if width != EXPECTED_WIDTH or height != EXPECTED_HEIGHT:
                    print(f" (expected {EXPECTED_WIDTH}×{EXPECTED_HEIGHT})", end="")
                print()
                
            except Exception as e:
                unreadable.append((filename, str(e)))
                print(f"✗ ERROR {filename:<35} Could not read file: {e}")
    
    print()
    print("=" * 70)
    print("Verification Results")
    print("=" * 70)
    print(f"Total images scanned:    {total_images}")
    print(f"Correct dimensions:      {correct_size} ({100*correct_size/max(1,total_images):.1f}%)")
    print(f"Wrong dimensions:        {len(wrong_size)}")
    print(f"Unreadable files:        {len(unreadable)}")
    print()
    
    # Details on failures
    if wrong_size:
        print("Images with wrong dimensions:")
        for filename, width, height in wrong_size:
            print(f"  - {filename}: {width}×{height}px (expected {EXPECTED_WIDTH}×{EXPECTED_HEIGHT}px)")
        print()
    
    if unreadable:
        print("Unreadable files:")
        for filename, error in unreadable:
            print(f"  - {filename}: {error}")
        print()
    
    # Summary
    print("=" * 70)
    if correct_size == total_images and total_images > 0:
        print("✓ VERIFICATION PASSED - All images are properly normalized!")
        print("  Ready for deployment to production.")
        return True
    elif total_images == 0:
        print("⚠ WARNING - No images found in directory")
        return False
    else:
        print("✗ VERIFICATION FAILED - Some images have incorrect dimensions")
        print("  Please review the script output above.")
        return False
    
    print("=" * 70)

def main():
    """Main entry point."""
    verify_images("img_normalized")

if __name__ == "__main__":
    main()
