@echo off
echo Installing required packages...
pip install -r requirements.txt

echo.
echo Extracting frames from video...
python video_frame_extractor.py

echo.
echo Frame extraction complete!
echo Check the 'extracted_frames' folder for the images.
pause
