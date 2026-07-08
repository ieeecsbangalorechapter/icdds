#!/usr/bin/env python3
"""
Committee Photo Normalization Tool
Normalizes all committee member photos to consistent dimensions with face-aware positioning.
"""

import os
import cv2
import numpy as np
from pathlib import Path
from PIL import Image
import shutil

# Configuration
NORMALIZED_WIDTH = 220
NORMALIZED_HEIGHT = 280
FACE_CASCADE_PATH = cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'

# Load face detection cascade
face_cascade = cv2.CascadeClassifier(FACE_CASCADE_PATH)

def detect_face_region(image_path):
    """Detect face in image and return bounding box."""
    img = cv2.imread(image_path)
    if img is None:
        return None
    
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(50, 50))
    
    if len(faces) > 0:
        # Get the largest face detected
        largest_face = max(faces, key=lambda f: f[2] * f[3])
        return largest_face, img.shape
    return None, img.shape

def process_image(input_path, output_path):
    """Process a single image with face-aware normalization."""
    try:
        # Read original image
        img = Image.open(input_path)
        img_cv = cv2.imread(input_path)
        
        if img_cv is None:
            print(f"Warning: Could not read {input_path}")
            return False
        
        img_height, img_width = img_cv.shape[:2]
        
        # Detect face
        face_data = detect_face_region(input_path)
        if face_data[0] is not None:
            (fx, fy, fw, fh), _ = face_data
        else:
            # Fallback: use center if face not detected
            fx, fy, fw, fh = img_width // 4, img_height // 4, img_width // 2, img_height // 2
        
        # Calculate scaling to fit target dimensions while preserving aspect ratio
        scale = min(NORMALIZED_WIDTH / img_width, NORMALIZED_HEIGHT / img_height)
        new_width = int(img_width * scale)
        new_height = int(img_height * scale)
        
        # Resize image proportionally
        img_resized = cv2.resize(img_cv, (new_width, new_height), interpolation=cv2.INTER_LANCZOS4)
        
        # Create canvas with target dimensions (white background)
        canvas = np.ones((NORMALIZED_HEIGHT, NORMALIZED_WIDTH, 3), dtype=np.uint8) * 255
        
        # Scale face position according to resized image
        scaled_fy = int(fy * scale)
        scaled_fh = int(fh * scale)
        
        # Position face with consistent top margin (30% from top for professional look)
        target_face_top = int(NORMALIZED_HEIGHT * 0.25)  # Face positioned at 25% from top
        offset_y = target_face_top - scaled_fy
        
        # Center horizontally
        offset_x = (NORMALIZED_WIDTH - new_width) // 2
        
        # Clamp offsets to keep image on canvas
        offset_y = max(0, min(offset_y, NORMALIZED_HEIGHT - new_height))
        offset_x = max(0, min(offset_x, NORMALIZED_WIDTH - new_width))
        
        # Place resized image on canvas
        y_end = min(offset_y + new_height, NORMALIZED_HEIGHT)
        x_end = min(offset_x + new_width, NORMALIZED_WIDTH)
        
        canvas[offset_y:y_end, offset_x:x_end] = img_resized[
            0:y_end - offset_y, 
            0:x_end - offset_x
        ]
        
        # Save processed image
        output_image = Image.fromarray(cv2.cvtColor(canvas, cv2.COLOR_BGR2RGB))
        output_image.save(output_path, quality=95)
        
        print(f"✓ Processed: {Path(input_path).name} -> {NORMALIZED_WIDTH}x{NORMALIZED_HEIGHT}")
        return True
        
    except Exception as e:
        print(f"✗ Error processing {input_path}: {e}")
        return False

def process_directory(input_dir, output_dir):
    """Process all images in a directory."""
    # Create output directory
    os.makedirs(output_dir, exist_ok=True)
    
    # Supported image extensions
    image_extensions = {'.jpg', '.jpeg', '.png', '.JPG', '.JPEG', '.PNG'}
    
    processed_count = 0
    failed_count = 0
    
    # Process all images
    for filename in os.listdir(input_dir):
        file_path = os.path.join(input_dir, filename)
        
        if os.path.isfile(file_path) and Path(filename).suffix.lower() in image_extensions:
            output_path = os.path.join(output_dir, filename)
            if process_image(file_path, output_path):
                processed_count += 1
            else:
                failed_count += 1
    
    return processed_count, failed_count

def main():
    """Main entry point."""
    print("=" * 60)
    print("Committee Photo Normalization Tool")
    print("=" * 60)
    print(f"\nTarget dimensions: {NORMALIZED_WIDTH}x{NORMALIZED_HEIGHT}px")
    print(f"Processing images with face detection...\n")
    
    # Process img directory
    input_dir = "img"
    output_dir = "img_normalized"
    
    if os.path.exists(input_dir):
        processed, failed = process_directory(input_dir, output_dir)
        print(f"\nProcessing complete!")
        print(f"✓ Successfully processed: {processed} images")
        if failed > 0:
            print(f"✗ Failed: {failed} images")
        print(f"\nNormalized images saved to: {output_dir}/")
    else:
        print(f"Error: {input_dir}/ directory not found")

if __name__ == "__main__":
    main()
