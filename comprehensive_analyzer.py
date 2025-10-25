import cv2
import numpy as np
import os
from pathlib import Path

def analyze_frame_content(frame_path):
    """
    Analyze a single frame for content detection
    """
    frame = cv2.imread(frame_path)
    if frame is None:
        return None
    
    # Convert to different color spaces for better analysis
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)
    
    # Get frame dimensions
    height, width = frame.shape[:2]
    
    # Detect edges
    edges = cv2.Canny(gray, 50, 150)
    
    # Detect contours
    contours, _ = cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    # Analyze color distribution
    mean_color = np.mean(frame, axis=(0, 1))
    dominant_colors = get_dominant_colors(frame)
    
    # Detect text regions (simple approach)
    text_regions = detect_text_regions(gray)
    
    # Detect rectangular shapes (potential UI elements)
    rectangles = detect_rectangles(contours)
    
    return {
        'dimensions': (width, height),
        'mean_color': mean_color,
        'dominant_colors': dominant_colors,
        'contour_count': len(contours),
        'text_regions': text_regions,
        'rectangles': rectangles,
        'edge_density': np.sum(edges > 0) / (width * height)
    }

def get_dominant_colors(frame, k=5):
    """
    Get dominant colors in the frame
    """
    data = frame.reshape((-1, 3))
    data = np.float32(data)
    
    criteria = (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 20, 1.0)
    _, labels, centers = cv2.kmeans(data, k, None, criteria, 10, cv2.KMEANS_RANDOM_CENTERS)
    
    centers = np.uint8(centers)
    return centers

def detect_text_regions(gray):
    """
    Simple text region detection
    """
    # Use morphological operations to detect text-like regions
    kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (3, 3))
    dilated = cv2.dilate(gray, kernel, iterations=1)
    
    # Find contours that might be text
    contours, _ = cv2.findContours(dilated, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    text_regions = []
    for contour in contours:
        x, y, w, h = cv2.boundingRect(contour)
        aspect_ratio = w / h
        area = cv2.contourArea(contour)
        
        # Text-like characteristics
        if 0.1 < aspect_ratio < 10 and area > 100:
            text_regions.append((x, y, w, h))
    
    return text_regions

def detect_rectangles(contours):
    """
    Detect rectangular shapes (potential UI elements)
    """
    rectangles = []
    for contour in contours:
        epsilon = 0.02 * cv2.arcLength(contour, True)
        approx = cv2.approxPolyDP(contour, epsilon, True)
        
        if len(approx) == 4:
            x, y, w, h = cv2.boundingRect(contour)
            area = cv2.contourArea(contour)
            if area > 500:  # Filter small rectangles
                rectangles.append((x, y, w, h))
    
    return rectangles

def analyze_all_frames():
    """
    Analyze all extracted frames
    """
    detailed_frames_dir = "detailed_analysis"
    analysis_results = []
    
    # Get all frame files
    frame_files = [f for f in os.listdir(detailed_frames_dir) if f.endswith('.jpg')]
    frame_files.sort()
    
    print("=== COMPREHENSIVE FRAME ANALYSIS ===")
    print(f"Analyzing {len(frame_files)} frames...")
    print("=" * 50)
    
    for i, frame_file in enumerate(frame_files):
        frame_path = os.path.join(detailed_frames_dir, frame_file)
        
        # Extract timestamp from filename
        if 'time_' in frame_file:
            timestamp_str = frame_file.split('time_')[1].split('s.jpg')[0]
            timestamp = float(timestamp_str)
        else:
            timestamp = i * 0.5
        
        # Analyze frame
        analysis = analyze_frame_content(frame_path)
        
        if analysis:
            analysis_results.append({
                'filename': frame_file,
                'timestamp': timestamp,
                'analysis': analysis
            })
            
            # Print significant changes
            if i > 0:
                prev_analysis = analysis_results[-2]['analysis']
                current_analysis = analysis
                
                # Check for significant changes
                color_change = np.linalg.norm(current_analysis['mean_color'] - prev_analysis['mean_color'])
                contour_change = abs(current_analysis['contour_count'] - prev_analysis['contour_count'])
                edge_change = abs(current_analysis['edge_density'] - prev_analysis['edge_density'])
                
                if color_change > 30 or contour_change > 10 or edge_change > 0.1:
                    print(f">>> SIGNIFICANT CHANGE at {timestamp:.1f}s:")
                    print(f"   File: {frame_file}")
                    print(f"   Color change: {color_change:.1f}")
                    print(f"   Contour change: {contour_change}")
                    print(f"   Edge density change: {edge_change:.3f}")
                    print(f"   Dominant colors: {current_analysis['dominant_colors'].tolist()}")
                    print(f"   Text regions: {len(current_analysis['text_regions'])}")
                    print(f"   Rectangles: {len(current_analysis['rectangles'])}")
                    print("-" * 40)
    
    # Generate comprehensive report
    generate_comprehensive_report(analysis_results)
    
    return analysis_results

def generate_comprehensive_report(analysis_results):
    """
    Generate a comprehensive analysis report
    """
    report_path = "comprehensive_analysis_report.txt"
    
    with open(report_path, 'w', encoding='utf-8') as f:
        f.write("=== COMPREHENSIVE VIDEO ANALYSIS REPORT ===\n\n")
        f.write(f"Total Frames Analyzed: {len(analysis_results)}\n")
        f.write(f"Video Duration: {analysis_results[-1]['timestamp']:.1f} seconds\n\n")
        
        f.write("FRAME-BY-FRAME ANALYSIS:\n")
        f.write("=" * 50 + "\n\n")
        
        for result in analysis_results:
            f.write(f"Frame: {result['filename']}\n")
            f.write(f"Time: {result['timestamp']:.1f}s\n")
            
            analysis = result['analysis']
            f.write(f"Dimensions: {analysis['dimensions']}\n")
            f.write(f"Mean Color (BGR): {analysis['mean_color']}\n")
            f.write(f"Dominant Colors: {analysis['dominant_colors'].tolist()}\n")
            f.write(f"Contours: {analysis['contour_count']}\n")
            f.write(f"Text Regions: {len(analysis['text_regions'])}\n")
            f.write(f"Rectangles: {len(analysis['rectangles'])}\n")
            f.write(f"Edge Density: {analysis['edge_density']:.3f}\n")
            f.write("-" * 30 + "\n\n")
        
        # Identify potential webpage transitions
        f.write("POTENTIAL WEBPAGE TRANSITIONS:\n")
        f.write("=" * 40 + "\n")
        
        transitions = []
        for i in range(1, len(analysis_results)):
            prev = analysis_results[i-1]['analysis']
            curr = analysis_results[i]['analysis']
            
            color_change = np.linalg.norm(curr['mean_color'] - prev['mean_color'])
            contour_change = abs(curr['contour_count'] - prev['contour_count'])
            edge_change = abs(curr['edge_density'] - prev['edge_density'])
            
            if color_change > 30 or contour_change > 10 or edge_change > 0.1:
                transitions.append({
                    'timestamp': analysis_results[i]['timestamp'],
                    'filename': analysis_results[i]['filename'],
                    'color_change': color_change,
                    'contour_change': contour_change,
                    'edge_change': edge_change
                })
        
        for transition in transitions:
            f.write(f"Transition at {transition['timestamp']:.1f}s:\n")
            f.write(f"  File: {transition['filename']}\n")
            f.write(f"  Color change: {transition['color_change']:.1f}\n")
            f.write(f"  Contour change: {transition['contour_change']}\n")
            f.write(f"  Edge change: {transition['edge_change']:.3f}\n")
            f.write("-" * 30 + "\n")
        
        f.write(f"\nTotal Transitions Detected: {len(transitions)}\n")
        f.write("\nRECOMMENDATIONS:\n")
        f.write("=" * 20 + "\n")
        f.write("1. Check frames with significant changes for QR code scans\n")
        f.write("2. Look for webpage content in transition frames\n")
        f.write("3. Analyze frames with high text region counts\n")
        f.write("4. Examine frames with multiple rectangles (UI elements)\n")
    
    print(f"\nComprehensive report saved to: {report_path}")

if __name__ == "__main__":
    print("Starting comprehensive frame analysis...")
    results = analyze_all_frames()
    print(f"\nAnalysis complete! Check 'comprehensive_analysis_report.txt' for detailed results.")
