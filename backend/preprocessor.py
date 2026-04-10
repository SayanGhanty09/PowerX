"""
Smart Energy Monitoring System - Data Preprocessing Module

This script handles data cleaning, normalization, and preprocessing
for energy consumption data.

Features:
- Load data from CSV
- Handle missing values
- Smooth data using moving average
- Normalize data
- Feature engineering
- Save preprocessed data

Author: Smart Energy System
Date: 2026
"""

import pandas as pd
import numpy as np
from scipy import signal
import os

# ==================== CONFIGURATION ====================
INPUT_FILE = "data/energy_data.csv"
OUTPUT_FILE = "data/energy_data_preprocessed.csv"

# Preprocessing Parameters
MOVING_AVERAGE_WINDOW = 5  # Window size for smoothing
OUTLIER_THRESHOLD = 3      # Standard deviations for outlier detection


class DataPreprocessor:
    """Handles data preprocessing and cleaning"""
    
    def __init__(self, input_file):
        """
        Initialize preprocessor
        
        Args:
            input_file (str): Path to raw data CSV
        """
        self.input_file = input_file
        self.data = None
        self.processed_data = None
    
    def load_data(self):
        """Load data from CSV file"""
        try:
            self.data = pd.read_csv(self.input_file)
            print(f"✓ Loaded {len(self.data)} records from {self.input_file}")
            print(f"\nData shape: {self.data.shape}")
            print(f"Columns: {list(self.data.columns)}")
            return True
        except FileNotFoundError:
            print(f"✗ File not found: {self.input_file}")
            return False
        except Exception as e:
            print(f"✗ Error loading data: {e}")
            return False
    
    def show_summary(self):
        """Display data summary statistics"""
        if self.data is None:
            print("✗ No data loaded")
            return
        
        print("\n" + "=" * 60)
        print("Data Summary")
        print("=" * 60)
        print(self.data.describe())
        
        print("\n" + "=" * 60)
        print("Missing Values")
        print("=" * 60)
        missing = self.data.isnull().sum()
        print(missing)
        
        print("\n" + "=" * 60)
        print("Data Types")
        print("=" * 60)
        print(self.data.dtypes)
    
    def handle_missing_values(self, method='forward_fill'):
        """
        Handle missing values in the dataset
        
        Args:
            method (str): Method to handle missing values
                         'forward_fill', 'backward_fill', 'interpolate', 'drop'
        """
        print(f"\n--- Handling Missing Values (method: {method}) ---")
        
        before = self.data.isnull().sum().sum()
        
        if method == 'forward_fill':
            self.data = self.data.fillna(method='ffill')
        elif method == 'backward_fill':
            self.data = self.data.fillna(method='bfill')
        elif method == 'interpolate':
            self.data = self.data.interpolate(method='linear')
        elif method == 'drop':
            self.data = self.data.dropna()
        else:
            print(f"⚠ Unknown method: {method}")
            return
        
        after = self.data.isnull().sum().sum()
        print(f"✓ Missing values: {before} → {after}")
    
    def remove_outliers(self, column, threshold=OUTLIER_THRESHOLD):
        """
        Remove outliers using Z-score method
        
        Args:
            column (str): Column name to check for outliers
            threshold (float): Number of standard deviations
        """
        print(f"\n--- Removing Outliers from '{column}' ---")
        
        before_count = len(self.data)
        
        # Calculate Z-scores
        mean = self.data[column].mean()
        std = self.data[column].std()
        z_scores = np.abs((self.data[column] - mean) / std)
        
        # Filter outliers
        self.data = self.data[z_scores < threshold]
        
        after_count = len(self.data)
        removed = before_count - after_count
        
        print(f"✓ Records: {before_count} → {after_count} (removed {removed} outliers)")
    
    def smooth_data(self, column, window=MOVING_AVERAGE_WINDOW, method='moving_average'):
        """
        Smooth data using moving average or other methods
        
        Args:
            column (str): Column to smooth
            window (int): Window size
            method (str): Smoothing method ('moving_average', 'exponential', 'savgol')
        """
        print(f"\n--- Smoothing '{column}' (method: {method}, window: {window}) ---")
        
        new_column = f"{column}_smoothed"
        
        if method == 'moving_average':
            self.data[new_column] = self.data[column].rolling(window=window, center=True).mean()
        
        elif method == 'exponential':
            self.data[new_column] = self.data[column].ewm(span=window, adjust=False).mean()
        
        elif method == 'savgol':
            # Savitzky-Golay filter for smoother results
            if len(self.data) >= window:
                self.data[new_column] = signal.savgol_filter(
                    self.data[column], 
                    window_length=window if window % 2 == 1 else window + 1,
                    polyorder=2
                )
            else:
                print(f"⚠ Not enough data for Savgol filter (need >= {window} points)")
                self.data[new_column] = self.data[column]
        
        # Fill NaN values created by rolling window
        self.data[new_column].fillna(method='bfill', inplace=True)
        self.data[new_column].fillna(method='ffill', inplace=True)
        
        print(f"✓ Created smoothed column: {new_column}")
    
    def normalize_data(self, column, method='min_max'):
        """
        Normalize data to a specific range
        
        Args:
            column (str): Column to normalize
            method (str): Normalization method ('min_max', 'z_score')
        """
        print(f"\n--- Normalizing '{column}' (method: {method}) ---")
        
        new_column = f"{column}_normalized"
        
        if method == 'min_max':
            # Scale to [0, 1]
            min_val = self.data[column].min()
            max_val = self.data[column].max()
            self.data[new_column] = (self.data[column] - min_val) / (max_val - min_val)
        
        elif method == 'z_score':
            # Standardize to mean=0, std=1
            mean = self.data[column].mean()
            std = self.data[column].std()
            self.data[new_column] = (self.data[column] - mean) / std
        
        print(f"✓ Created normalized column: {new_column}")
    
    def create_features(self):
        """Create additional features for analysis"""
        print("\n--- Creating Additional Features ---")
        
        # Pulse rate (change in pulse count over time)
        if 'pulse_count' in self.data.columns:
            self.data['pulse_rate'] = self.data['pulse_count'].diff().fillna(0)
            print("✓ Created feature: pulse_rate")
        
        # LDR value change
        if 'ldr_value' in self.data.columns:
            self.data['ldr_change'] = self.data['ldr_value'].diff().fillna(0)
            print("✓ Created feature: ldr_change")
        
        # Time-based features (if timestamp exists)
        if 'timestamp' in self.data.columns:
            try:
                self.data['timestamp'] = pd.to_datetime(self.data['timestamp'])
                self.data['hour'] = self.data['timestamp'].dt.hour
                self.data['day_of_week'] = self.data['timestamp'].dt.dayofweek
                print("✓ Created features: hour, day_of_week")
            except:
                print("⚠ Could not parse timestamp")
    
    def save_processed_data(self, output_file=OUTPUT_FILE):
        """
        Save preprocessed data to CSV
        
        Args:
            output_file (str): Output file path
        """
        try:
            self.data.to_csv(output_file, index=False)
            print(f"\n✓ Preprocessed data saved to: {output_file}")
            print(f"  Records: {len(self.data)}")
            print(f"  Columns: {list(self.data.columns)}")
        except Exception as e:
            print(f"✗ Error saving data: {e}")
    
    def preprocess_pipeline(self):
        """Run complete preprocessing pipeline"""
        print("\n" + "=" * 60)
        print("Data Preprocessing Pipeline")
        print("=" * 60)
        
        # 1. Load data
        if not self.load_data():
            return False
        
        # 2. Show initial summary
        self.show_summary()
        
        # 3. Handle missing values
        self.handle_missing_values(method='interpolate')
        
        # 4. Remove outliers from LDR values
        if 'ldr_value' in self.data.columns:
            self.remove_outliers('ldr_value', threshold=3)
        
        # 5. Smooth LDR values
        if 'ldr_value' in self.data.columns:
            self.smooth_data('ldr_value', window=5, method='moving_average')
        
        # 6. Smooth pulse count
        if 'pulse_count' in self.data.columns:
            self.smooth_data('pulse_count', window=5, method='moving_average')
        
        # 7. Normalize data
        if 'ldr_value' in self.data.columns:
            self.normalize_data('ldr_value', method='min_max')
        
        # 8. Create additional features
        self.create_features()
        
        # 9. Save processed data
        self.save_processed_data()
        
        print("\n" + "=" * 60)
        print("✓ Preprocessing Complete!")
        print("=" * 60)
        
        return True


if __name__ == "__main__":
    # Run preprocessing pipeline
    preprocessor = DataPreprocessor(INPUT_FILE)
    
    if preprocessor.preprocess_pipeline():
        print("\n✓ Data is ready for anomaly detection!")
    else:
        print("\n✗ Preprocessing failed")