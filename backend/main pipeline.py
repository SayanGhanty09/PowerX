"""
Smart Energy Monitoring System - Main Pipeline

This script orchestrates the complete energy monitoring pipeline:
1. Data Fetching from Consentium IoT
2. Data Preprocessing
3. Anomaly Detection
4. Visualization

Can run in different modes:
- Full Pipeline: All steps sequentially
- Individual Steps: Run specific components
- Continuous Monitoring: Real-time data collection and analysis

Author: Smart Energy System
Date: 2026
"""

import os
import sys
import time
from datetime import datetime
import argparse

# Import modules
try:
    from data_fetcher import ConsentiumDataFetcher, continuous_monitoring
    from preprocessor import DataPreprocessor
    from anomaly_detector import AnomalyDetector
    from visualizer import EnergyDataVisualizer
except ImportError as e:
    print(f"✗ Import Error: {e}")
    print("Make sure all modules are in the same directory.")
    sys.exit(1)

# ==================== CONFIGURATION ====================
DATA_DIR = "data"
RESULTS_DIR = "results"

# File paths
RAW_DATA_FILE = os.path.join(DATA_DIR, "energy_data.csv")
PREPROCESSED_FILE = os.path.join(DATA_DIR, "energy_data_preprocessed.csv")
ANOMALY_FILE = os.path.join(DATA_DIR, "anomalies_detected.csv")


class SmartEnergyPipeline:
    """Main pipeline orchestrator"""
    
    def __init__(self):
        """Initialize pipeline"""
        self.setup_directories()
        self.api_key = None
    
    def setup_directories(self):
        """Create necessary directories"""
        for directory in [DATA_DIR, RESULTS_DIR]:
            if not os.path.exists(directory):
                os.makedirs(directory)
                print(f"✓ Created directory: {directory}")
    
    def configure_api(self):
        """Configure API key"""
        print("\n--- API Configuration ---")
        self.api_key = input("Enter your Consentium IoT API Key: ")
        
        if not self.api_key or self.api_key == "YOUR_API_KEY":
            print("⚠ Warning: Using placeholder API key")
            print("  Data fetching will fail without valid API key")
        else:
            print("✓ API key configured")
    
    def step_1_fetch_data(self, duration_minutes=5):
        """
        Step 1: Fetch data from Consentium IoT
        
        Args:
            duration_minutes (int): How long to collect data
        """
        print("\n" + "=" * 60)
        print("STEP 1: Data Fetching")
        print("=" * 60)
        
        if not self.api_key:
            self.configure_api()
        
        print(f"\nCollecting data for {duration_minutes} minutes...")
        print("Press Ctrl+C to stop early\n")
        
        try:
            # Use the continuous monitoring function
            continuous_monitoring(duration_minutes)
            
            if os.path.exists(RAW_DATA_FILE):
                print(f"\n✓ Step 1 Complete: Data saved to {RAW_DATA_FILE}")
                return True
            else:
                print("\n✗ Step 1 Failed: No data collected")
                return False
                
        except Exception as e:
            print(f"\n✗ Step 1 Error: {e}")
            return False
    
    def step_2_preprocess(self):
        """Step 2: Preprocess the data"""
        print("\n" + "=" * 60)
        print("STEP 2: Data Preprocessing")
        print("=" * 60)
        
        if not os.path.exists(RAW_DATA_FILE):
            print(f"✗ Raw data file not found: {RAW_DATA_FILE}")
            print("  Run Step 1 first to collect data")
            return False
        
        try:
            preprocessor = DataPreprocessor(RAW_DATA_FILE)
            
            if preprocessor.preprocess_pipeline():
                print(f"\n✓ Step 2 Complete: Preprocessed data saved to {PREPROCESSED_FILE}")
                return True
            else:
                print("\n✗ Step 2 Failed")
                return False
                
        except Exception as e:
            print(f"\n✗ Step 2 Error: {e}")
            return False
    
    def step_3_detect_anomalies(self):
        """Step 3: Detect anomalies"""
        print("\n" + "=" * 60)
        print("STEP 3: Anomaly Detection")
        print("=" * 60)
        
        if not os.path.exists(PREPROCESSED_FILE):
            print(f"✗ Preprocessed data not found: {PREPROCESSED_FILE}")
            print("  Run Step 2 first to preprocess data")
            return False
        
        try:
            detector = AnomalyDetector(PREPROCESSED_FILE)
            
            if detector.run_all_detectors():
                print(f"\n✓ Step 3 Complete: Anomalies saved to {ANOMALY_FILE}")
                return True
            else:
                print("\n✗ Step 3 Failed")
                return False
                
        except Exception as e:
            print(f"\n✗ Step 3 Error: {e}")
            return False
    
    def step_4_visualize(self, plot_type='dashboard'):
        """
        Step 4: Visualize results
        
        Args:
            plot_type (str): 'dashboard' or 'simple'
        """
        print("\n" + "=" * 60)
        print("STEP 4: Visualization")
        print("=" * 60)
        
        if not os.path.exists(ANOMALY_FILE):
            print(f"✗ Anomaly data not found: {ANOMALY_FILE}")
            print("  Run Step 3 first to detect anomalies")
            return False
        
        try:
            visualizer = EnergyDataVisualizer(ANOMALY_FILE)
            
            if visualizer.load_data():
                if plot_type == 'dashboard':
                    visualizer.create_dashboard()
                else:
                    visualizer.create_simple_plot()
                
                print("\n✓ Step 4 Complete: Visualization generated")
                return True
            else:
                print("\n✗ Step 4 Failed")
                return False
                
        except Exception as e:
            print(f"\n✗ Step 4 Error: {e}")
            return False
    
    def run_full_pipeline(self, fetch_duration=5):
        """
        Run complete pipeline
        
        Args:
            fetch_duration (int): Data collection duration in minutes
        """
        print("\n" + "=" * 70)
        print(" " * 15 + "SMART ENERGY MONITORING SYSTEM")
        print(" " * 20 + "Full Pipeline Execution")
        print("=" * 70)
        
        start_time = time.time()
        
        # Step 1: Fetch Data
        if not self.step_1_fetch_data(fetch_duration):
            print("\n⚠ Pipeline stopped: Data fetching failed")
            return False
        
        # Step 2: Preprocess
        if not self.step_2_preprocess():
            print("\n⚠ Pipeline stopped: Preprocessing failed")
            return False
        
        # Step 3: Detect Anomalies
        if not self.step_3_detect_anomalies():
            print("\n⚠ Pipeline stopped: Anomaly detection failed")
            return False
        
        # Step 4: Visualize
        if not self.step_4_visualize():
            print("\n⚠ Pipeline stopped: Visualization failed")
            return False
        
        # Success!
        elapsed = time.time() - start_time
        
        print("\n" + "=" * 70)
        print("✓ PIPELINE COMPLETE!")
        print("=" * 70)
        print(f"\nTotal execution time: {elapsed:.2f} seconds")
        print(f"\nResults location:")
        print(f"  Raw data: {RAW_DATA_FILE}")
        print(f"  Preprocessed: {PREPROCESSED_FILE}")
        print(f"  Anomalies: {ANOMALY_FILE}")
        print(f"  Visualizations: {RESULTS_DIR}/")
        
        return True
    
    def interactive_menu(self):
        """Interactive menu for pipeline control"""
        while True:
            print("\n" + "=" * 60)
            print("Smart Energy Monitoring System - Control Menu")
            print("=" * 60)
            print("\n1. Run Full Pipeline")
            print("2. Step 1: Fetch Data Only")
            print("3. Step 2: Preprocess Data Only")
            print("4. Step 3: Detect Anomalies Only")
            print("5. Step 4: Visualize Results Only")
            print("6. Configure API Key")
            print("7. Exit")
            
            choice = input("\nEnter choice (1-7): ")
            
            if choice == "1":
                duration = input("Data collection duration (minutes, default=5): ")
                duration = int(duration) if duration else 5
                self.run_full_pipeline(duration)
            
            elif choice == "2":
                duration = input("Data collection duration (minutes, default=5): ")
                duration = int(duration) if duration else 5
                self.step_1_fetch_data(duration)
            
            elif choice == "3":
                self.step_2_preprocess()
            
            elif choice == "4":
                self.step_3_detect_anomalies()
            
            elif choice == "5":
                plot_type = input("Plot type (1=Dashboard, 2=Simple): ")
                self.step_4_visualize('dashboard' if plot_type == '1' else 'simple')
            
            elif choice == "6":
                self.configure_api()
            
            elif choice == "7":
                print("\nExiting...")
                break
            
            else:
                print("✗ Invalid choice")


def main():
    """Main entry point"""
    parser = argparse.ArgumentParser(description='Smart Energy Monitoring System')
    parser.add_argument('--mode', choices=['full', 'interactive', 'fetch', 'preprocess', 'detect', 'visualize'],
                       default='interactive', help='Execution mode')
    parser.add_argument('--duration', type=int, default=5, 
                       help='Data collection duration in minutes (for fetch mode)')
    parser.add_argument('--api-key', type=str, help='Consentium IoT API key')
    
    args = parser.parse_args()
    
    # Create pipeline
    pipeline = SmartEnergyPipeline()
    
    # Set API key if provided
    if args.api_key:
        pipeline.api_key = args.api_key
    
    # Execute based on mode
    if args.mode == 'full':
        pipeline.run_full_pipeline(args.duration)
    
    elif args.mode == 'fetch':
        pipeline.step_1_fetch_data(args.duration)
    
    elif args.mode == 'preprocess':
        pipeline.step_2_preprocess()
    
    elif args.mode == 'detect':
        pipeline.step_3_detect_anomalies()
    
    elif args.mode == 'visualize':
        pipeline.step_4_visualize()
    
    else:  # interactive
        pipeline.interactive_menu()


if __name__ == "__main__":
    main()