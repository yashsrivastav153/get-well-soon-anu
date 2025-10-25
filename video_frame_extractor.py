import cv2
import os
from pathlib import Path

def extract_frames_from_video(video_path, output_folder, interval_seconds=1):
    """
    Extract frames from video at specified intervals
    
    Args:
        video_path: Path to the video file
        output_folder: Folder to save extracted frames
        interval_seconds: Time interval between frames (in seconds)
    """
    
    # Create output folder if it doesn't exist
    Path(output_folder).mkdir(exist_ok=True)
    
    # Open video file
    cap = cv2.VideoCapture(video_path)
    
    if not cap.isOpened():
        print(f"Error: Could not open video file {video_path}")
        return
    
    # Get video properties
    fps = cap.get(cv2.CAP_PROP_FPS)
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    duration = total_frames / fps
    
    print(f"Video Info:")
    print(f"- FPS: {fps}")
    print(f"- Total Frames: {total_frames}")
    print(f"- Duration: {duration:.2f} seconds")
    print(f"- Extracting frames every {interval_seconds} seconds...")
    
    frame_interval = int(fps * interval_seconds)
    frame_count = 0
    saved_count = 0
    
    while True:
        ret, frame = cap.read()
        
        if not ret:
            break
            
        # Save frame at specified intervals
        if frame_count % frame_interval == 0:
            timestamp = frame_count / fps
            filename = f"frame_{saved_count:03d}_time_{timestamp:.1f}s.jpg"
            filepath = os.path.join(output_folder, filename)
            
            cv2.imwrite(filepath, frame)
            print(f"Saved: {filename} (Time: {timestamp:.1f}s)")
            saved_count += 1
        
        frame_count += 1
    
    cap.release()
    print(f"\nExtraction complete! Saved {saved_count} frames to '{output_folder}' folder")

if __name__ == "__main__":
    # Configuration
    video_file = "VID-qr gift.mp4"  # Your video file
    output_directory = "extracted_frames"
    frame_interval = 1  # Extract every 1 second
    
    # Check if video file exists
    if not os.path.exists(video_file):
        print(f"Error: Video file '{video_file}' not found!")
        print("Make sure the video file is in the same directory as this script.")
    else:
        extract_frames_from_video(video_file, output_directory, frame_interval)
