"""
Smart Energy Monitoring System - Data Fetching Module

This script fetches energy monitoring data from Consentium IoT platform
and stores it in CSV format for further analysis.

Features:
- Fetch data using Consentium Read API
- Parse and structure data
- Save to CSV with timestamps
- Error handling and retry logic

Author: Smart Energy System
Date: 2026
"""

import requests
import pandas as pd
import json
from datetime import datetime
import time
import os

# ==================== CONFIGURATION ====================
# Consentium IoT Configuration
CONSENTIUM_READ_API = "http://api.consentiumiot.com/api/read"
API_KEY = "df87a1133e1dd89441758a2c8e1a9550"  # Replace with your Consentium API key

# Data Storage Configuration
OUTPUT_DIR = "data"
OUTPUT_FILE = os.path.join(OUTPUT_DIR, "energy_data.csv")

# Fetch Configuration
FETCH_INTERVAL = 10  # Fetch data every 10 seconds (for continuous monitoring)
MAX_RETRIES = 3      # Maximum retry attempts on failure


class ConsentiumDataFetcher:
    """Handles data fetching from Consentium IoT platform"""
    
    def __init__(self, api_key):
        """
        Initialize the data fetcher
        
        Args:
            api_key (str): Consentium IoT API key
        """
        self.api_key = api_key
        self.base_url = CONSENTIUM_READ_API
        
        # Create output directory if it doesn't exist
        if not os.path.exists(OUTPUT_DIR):
            os.makedirs(OUTPUT_DIR)
            print(f"✓ Created directory: {OUTPUT_DIR}")
    
    def fetch_latest_data(self):
        """
        Fetch latest data from Consentium IoT
        
        Returns:
            dict: Parsed data or None if failed
        """
        try:
            # Build request URL
            url = f"{self.base_url}?apikey={self.api_key}"
            
            # Make GET request
            response = requests.get(url, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                return self._parse_response(data)
            else:
                print(f"✗ Error: HTTP {response.status_code}")
                return None
                
        except requests.exceptions.RequestException as e:
            print(f"✗ Request failed: {e}")
            return None
    
    def _parse_response(self, data):
        """
        Parse Consentium API response
        
        Args:
            data (dict): Raw API response
            
        Returns:
            dict: Parsed data with timestamp
        """
        try:
            # Extract fields (adjust based on actual API response structure)
            parsed = {
                'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                'ldr_value': float(data.get('field1', 0)),
                'pulse_count': int(data.get('field2', 0))
            }
            return parsed
        except (KeyError, ValueError) as e:
            print(f"✗ Parsing error: {e}")
            return None
    
    def save_to_csv(self, data, mode='a'):
        """
        Save data to CSV file
        
        Args:
            data (dict): Data to save
            mode (str): File mode ('w' for overwrite, 'a' for append)
        """
        try:
            df = pd.DataFrame([data])
            
            # Check if file exists for append mode
            file_exists = os.path.exists(OUTPUT_FILE)
            
            if mode == 'a' and file_exists:
                # Append without headers
                df.to_csv(OUTPUT_FILE, mode='a', header=False, index=False)
            else:
                # Write with headers
                df.to_csv(OUTPUT_FILE, mode='w', header=True, index=False)
            
            print(f"✓ Data saved: LDR={data['ldr_value']}, Pulses={data['pulse_count']}")
            
        except Exception as e:
            print(f"✗ Save error: {e}")
    
    def fetch_with_retry(self, retries=MAX_RETRIES):
        """
        Fetch data with retry logic
        
        Args:
            retries (int): Number of retry attempts
            
        Returns:
            dict: Fetched data or None
        """
        for attempt in range(retries):
            data = self.fetch_latest_data()
            if data:
                return data
            
            if attempt < retries - 1:
                wait_time = 2 ** attempt  # Exponential backoff
                print(f"⟳ Retry {attempt + 1}/{retries} in {wait_time}s...")
                time.sleep(wait_time)
        
        return None


def continuous_monitoring(duration_minutes=None):
    """
    Continuously fetch and store data
    
    Args:
        duration_minutes (int): Monitoring duration in minutes (None for infinite)
    """
    print("\n" + "=" * 60)
    print("Smart Energy Monitoring - Data Collection")
    print("=" * 60 + "\n")
    
    fetcher = ConsentiumDataFetcher(API_KEY)
    
    start_time = time.time()
    iteration = 0
    
    print(f"Started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"Output file: {OUTPUT_FILE}")
    print(f"Fetch interval: {FETCH_INTERVAL} seconds\n")
    
    try:
        while True:
            iteration += 1
            print(f"\n--- Iteration {iteration} ---")
            print(f"Time: {datetime.now().strftime('%H:%M:%S')}")
            
            # Fetch data
            data = fetcher.fetch_with_retry()
            
            if data:
                # Save to CSV
                fetcher.save_to_csv(data)
            else:
                print("⚠ Failed to fetch data after retries")
            
            # Check duration limit
            if duration_minutes:
                elapsed = (time.time() - start_time) / 60
                if elapsed >= duration_minutes:
                    print(f"\n✓ Monitoring complete ({duration_minutes} minutes)")
                    break
            
            # Wait before next fetch
            time.sleep(FETCH_INTERVAL)
            
    except KeyboardInterrupt:
        print("\n\n⚠ Monitoring stopped by user")
    
    print(f"\nTotal iterations: {iteration}")
    print(f"Data saved to: {OUTPUT_FILE}")


def fetch_single_sample():
    """Fetch a single data sample (for testing)"""
    print("\n" + "=" * 60)
    print("Single Data Fetch Test")
    print("=" * 60 + "\n")
    
    fetcher = ConsentiumDataFetcher(API_KEY)
    data = fetcher.fetch_with_retry()
    
    if data:
        print("\n✓ Data fetched successfully:")
        print(json.dumps(data, indent=2))
        
        fetcher.save_to_csv(data, mode='w')
        print(f"\n✓ Saved to: {OUTPUT_FILE}")
    else:
        print("\n✗ Failed to fetch data")


if __name__ == "__main__":
    # Choose mode:
    # 1. Single fetch (testing)
    # 2. Continuous monitoring
    
    mode = input("Select mode:\n1. Single fetch (test)\n2. Continuous monitoring\nChoice (1/2): ")
    
    if mode == "1":
        fetch_single_sample()
    else:
        duration = input("\nDuration in minutes (press Enter for infinite): ")
        duration = int(duration) if duration else None
        continuous_monitoring(duration)