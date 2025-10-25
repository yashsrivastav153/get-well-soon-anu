import cv2
import numpy as np
import os
from pathlib import Path

def analyze_video_frames(video_path, output_folder):
    """
    Advanced video analysis to detect QR codes and extract text/features
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
    
    print(f"=== VIDEO ANALYSIS REPORT ===")
    print(f"Video: {video_path}")
    print(f"Duration: {duration:.2f} seconds")
    print(f"FPS: {fps}")
    print(f"Total Frames: {total_frames}")
    print("=" * 50)
    
    # Initialize QR code detector
    qr_detector = cv2.QRCodeDetector()
    
    frame_count = 0
    qr_detections = []
    webpage_transitions = []
    
    # Analyze every frame
    while True:
        ret, frame = cap.read()
        
        if not ret:
            break
            
        timestamp = frame_count / fps
        
        # Try to detect QR codes
        data, bbox, _ = qr_detector.detectAndDecode(frame)
        
        if data:
            qr_detections.append({
                'timestamp': timestamp,
                'frame': frame_count,
                'qr_data': data,
                'bbox': bbox
            })
            print(f"QR CODE DETECTED at {timestamp:.1f}s:")
            print(f"  - Frame: {frame_count}")
            print(f"  - Data: {data}")
            print(f"  - Bounding Box: {bbox}")
            print("-" * 30)
        
        # Save frame for manual analysis
        if frame_count % int(fps) == 0:  # Every second
            filename = f"analysis_frame_{frame_count:03d}_time_{timestamp:.1f}s.jpg"
            filepath = os.path.join(output_folder, filename)
            cv2.imwrite(filepath, frame)
        
        frame_count += 1
    
    cap.release()
    
    # Generate analysis report
    generate_analysis_report(qr_detections, output_folder, duration)
    
    return qr_detections

def generate_analysis_report(qr_detections, output_folder, duration):
    """
    Generate a detailed analysis report
    """
    report_path = os.path.join(output_folder, "video_analysis_report.txt")
    
    with open(report_path, 'w', encoding='utf-8') as f:
        f.write("=== COMPLETE VIDEO ANALYSIS REPORT ===\n\n")
        f.write(f"Video Duration: {duration:.2f} seconds\n")
        f.write(f"Total QR Codes Detected: {len(qr_detections)}\n\n")
        
        if qr_detections:
            f.write("QR CODE DETECTION RESULTS:\n")
            f.write("=" * 40 + "\n")
            
            for i, detection in enumerate(qr_detections, 1):
                f.write(f"\nQR Code #{i}:\n")
                f.write(f"  Time: {detection['timestamp']:.1f} seconds\n")
                f.write(f"  Frame: {detection['frame']}\n")
                f.write(f"  Data/URL: {detection['qr_data']}\n")
                f.write(f"  Position: {detection['bbox']}\n")
                f.write("-" * 30 + "\n")
        else:
            f.write("No QR codes were automatically detected.\n")
            f.write("This could mean:\n")
            f.write("1. QR codes are too small or blurry\n")
            f.write("2. QR codes are not standard format\n")
            f.write("3. Manual analysis of frames is needed\n\n")
        
        f.write("\nNEXT STEPS:\n")
        f.write("=" * 20 + "\n")
        f.write("1. Check the extracted frame images manually\n")
        f.write("2. Look for webpages that open after QR scanning\n")
        f.write("3. Document all text, images, buttons, and design elements\n")
        f.write("4. Note the sequence of pages and navigation flow\n")
    
    print(f"\nAnalysis report saved to: {report_path}")

def extract_detailed_frames(video_path, output_folder, interval=0.5):
    """
    Extract frames at smaller intervals for detailed analysis
    """
    cap = cv2.VideoCapture(video_path)
    fps = cap.get(cv2.CAP_PROP_FPS)
    frame_interval = int(fps * interval)
    
    frame_count = 0
    saved_count = 0
    
    print(f"\nExtracting detailed frames every {interval} seconds...")
    
    while True:
        ret, frame = cap.read()
        if not ret:
            break
            
        if frame_count % frame_interval == 0:
            timestamp = frame_count / fps
            filename = f"detailed_frame_{saved_count:04d}_time_{timestamp:.1f}s.jpg"
            filepath = os.path.join(output_folder, filename)
            cv2.imwrite(filepath, frame)
            saved_count += 1
        
        frame_count += 1
    
    cap.release()
    print(f"Saved {saved_count} detailed frames")

if __name__ == "__main__":
    video_file = "VID-qr gift.mp4"
    output_directory = "detailed_analysis"
    
    if not os.path.exists(video_file):
        print(f"Error: Video file '{video_file}' not found!")
    else:
        # Run advanced analysis
        qr_detections = analyze_video_frames(video_file, output_directory)
        
        # Extract more detailed frames
        extract_detailed_frames(video_file, output_directory, interval=0.5)
        
        print(f"\n=== ANALYSIS COMPLETE ===")
        print(f"Check the '{output_directory}' folder for:")
        print(f"- video_analysis_report.txt (detailed report)")
        print(f"- detailed_frame_*.jpg (frame images)")
        print(f"- QR code detection results")
