@echo off
REM Committee Photo Normalization Setup for Windows

echo.
echo ==========================================
echo Committee Photo Normalization Setup
echo ==========================================
echo.

REM Check if Python is available
python --version >nul 2>&1
if errorlevel 1 (
    echo Error: Python is required but not installed.
    echo Please install Python 3.8+ from https://www.python.org
    echo Make sure to check "Add Python to PATH" during installation.
    pause
    exit /b 1
)

echo Python found. Installing required packages...
echo.

REM Install required packages
python -m pip install --quiet opencv-python pillow numpy

if errorlevel 1 (
    echo Error: Failed to install dependencies
    pause
    exit /b 1
)

echo Dependencies installed successfully!
echo.
echo Running photo normalization...
echo.

python normalize_photos.py

echo.
echo ==========================================
echo Normalization complete!
echo ==========================================
echo.
echo Next steps:
echo 1. Review normalized images in img_normalized folder
echo 2. Backup original img folder (copy img to img_backup)
echo 3. Replace img contents with img_normalized contents
echo 4. Test pages in browser to verify consistency
echo 5. See PHOTO_NORMALIZATION_GUIDE.md for details
echo.
pause
