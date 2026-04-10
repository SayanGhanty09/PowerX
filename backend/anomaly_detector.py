"""
Smart Energy Monitoring System - Anomaly Detection Module

This script implements multiple anomaly detection algorithms to identify
irregular patterns in energy consumption data.

Algorithms Implemented:
1. Statistical Method (Mean + Standard Deviation)
2. Isolation Forest (Scikit-learn)
3. Z-Score Method
4. Interquartile Range (IQR) Method

Features:
- Multiple detection methods
- Anomaly scoring
- Real-time detection capability
- Visualization of results

Author: Smart Energy System
Date: 2026
"""

import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler
import matplotlib.pyplot as plt
import seaborn as sns
from datetime import datetime
import warnings
warnings.filterwarnings('ignore')

# ==================== CONFIGURATION ====================
INPUT_FILE = "data/energy_data_preprocessed.csv"
OUTPUT_FILE = "data/anomalies_detected.csv"
PLOT_FILE = "results/anomaly_plot.png"

# Detection Parameters
STATISTICAL_THRESHOLD = 2.5  # Standard deviations for statistical method
Z_SCORE_THRESHOLD = 3.0      # Z-score threshold
IQR_MULTIPLIER = 1.5         # IQR multiplier for outlier detection
ISOLATION_CONTAMINATION = 0.1  # Expected proportion of anomalies (10%)


class AnomalyDetector:
    """Multi-method anomaly detection for energy monitoring data"""
    
    def __init__(self, data_file):
        """
        Initialize anomaly detector
        
        Args:
            data_file (str): Path to preprocessed data CSV
        """
        self.data_file = data_file
        self.data = None
        self.anomalies = None
        self.results = {}
    
    def load_data(self):
        """Load preprocessed data"""
        try:
            self.data = pd.read_csv(self.data_file)
            print(f"✓ Loaded {len(self.data)} records from {self.data_file}")
            
            # Initialize anomaly tracking columns
            self.data['is_anomaly_statistical'] = False
            self.data['is_anomaly_isolation_forest'] = False
            self.data['is_anomaly_zscore'] = False
            self.data['is_anomaly_iqr'] = False
            self.data['anomaly_score'] = 0.0
            
            return True
        except Exception as e:
            print(f"✗ Error loading data: {e}")
            return False
    
    def detect_statistical(self, column='ldr_value', threshold=STATISTICAL_THRESHOLD):
        """
        Method 1: Statistical anomaly detection using mean and standard deviation
        
        Detects points that are more than N standard deviations from the mean.
        
        Args:
            column (str): Column to analyze
            threshold (float): Number of standard deviations
            
        Returns:
            int: Number of anomalies detected
        """
        print(f"\n--- Statistical Method (Threshold: {threshold} σ) ---")
        
        if column not in self.data.columns:
            print(f"✗ Column '{column}' not found")
            return 0
        
        # Calculate statistics
        mean = self.data[column].mean()
        std = self.data[column].std()
        
        # Define upper and lower bounds
        upper_bound = mean + (threshold * std)
        lower_bound = mean - (threshold * std)
        
        # Detect anomalies
        anomalies = (self.data[column] > upper_bound) | (self.data[column] < lower_bound)
        self.data['is_anomaly_statistical'] = anomalies
        
        count = anomalies.sum()
        percentage = (count / len(self.data)) * 100
        
        print(f"✓ Detected {count} anomalies ({percentage:.2f}%)")
        print(f"  Mean: {mean:.2f}, Std: {std:.2f}")
        print(f"  Bounds: [{lower_bound:.2f}, {upper_bound:.2f}]")
        
        self.results['statistical'] = {
            'count': count,
            'percentage': percentage,
            'mean': mean,
            'std': std,
            'bounds': (lower_bound, upper_bound)
        }
        
        return count
    
    def detect_isolation_forest(self, features=['ldr_value', 'pulse_count'], 
                                contamination=ISOLATION_CONTAMINATION):
        """
        Method 2: Isolation Forest anomaly detection
        
        Uses ensemble of isolation trees to identify anomalies.
        Works well for high-dimensional data and doesn't assume normal distribution.
        
        Args:
            features (list): List of features to use
            contamination (float): Expected proportion of anomalies
            
        Returns:
            int: Number of anomalies detected
        """
        print(f"\n--- Isolation Forest (Contamination: {contamination}) ---")
        
        # Check if features exist
        available_features = [f for f in features if f in self.data.columns]
        if not available_features:
            print(f"✗ None of the specified features found")
            return 0
        
        print(f"  Using features: {available_features}")
        
        # Prepare data
        X = self.data[available_features].values
        
        # Handle missing values
        X = np.nan_to_num(X, nan=0.0)
        
        # Create and train model
        iso_forest = IsolationForest(
            contamination=contamination,
            random_state=42,
            n_estimators=100
        )
        
        # Predict (-1 for anomalies, 1 for normal)
        predictions = iso_forest.fit_predict(X)
        anomaly_scores = iso_forest.score_samples(X)
        
        # Mark anomalies
        self.data['is_anomaly_isolation_forest'] = predictions == -1
        self.data['isolation_forest_score'] = -anomaly_scores  # Invert for intuitive scoring
        
        count = (predictions == -1).sum()
        percentage = (count / len(self.data)) * 100
        
        print(f"✓ Detected {count} anomalies ({percentage:.2f}%)")
        
        self.results['isolation_forest'] = {
            'count': count,
            'percentage': percentage,
            'features': available_features
        }
        
        return count
    
    def detect_zscore(self, column='ldr_value', threshold=Z_SCORE_THRESHOLD):
        """
        Method 3: Z-Score anomaly detection
        
        Standardizes data and detects points with extreme Z-scores.
        
        Args:
            column (str): Column to analyze
            threshold (float): Z-score threshold
            
        Returns:
            int: Number of anomalies detected
        """
        print(f"\n--- Z-Score Method (Threshold: {threshold}) ---")
        
        if column not in self.data.columns:
            print(f"✗ Column '{column}' not found")
            return 0
        
        # Calculate Z-scores
        mean = self.data[column].mean()
        std = self.data[column].std()
        z_scores = np.abs((self.data[column] - mean) / std)
        
        # Detect anomalies
        anomalies = z_scores > threshold
        self.data['is_anomaly_zscore'] = anomalies
        self.data['zscore'] = z_scores
        
        count = anomalies.sum()
        percentage = (count / len(self.data)) * 100
        
        print(f"✓ Detected {count} anomalies ({percentage:.2f}%)")
        
        self.results['zscore'] = {
            'count': count,
            'percentage': percentage
        }
        
        return count
    
    def detect_iqr(self, column='ldr_value', multiplier=IQR_MULTIPLIER):
        """
        Method 4: Interquartile Range (IQR) anomaly detection
        
        Detects outliers using the IQR method (box plot method).
        
        Args:
            column (str): Column to analyze
            multiplier (float): IQR multiplier (typically 1.5)
            
        Returns:
            int: Number of anomalies detected
        """
        print(f"\n--- IQR Method (Multiplier: {multiplier}) ---")
        
        if column not in self.data.columns:
            print(f"✗ Column '{column}' not found")
            return 0
        
        # Calculate quartiles
        Q1 = self.data[column].quantile(0.25)
        Q3 = self.data[column].quantile(0.75)
        IQR = Q3 - Q1
        
        # Define bounds
        lower_bound = Q1 - (multiplier * IQR)
        upper_bound = Q3 + (multiplier * IQR)
        
        # Detect anomalies
        anomalies = (self.data[column] < lower_bound) | (self.data[column] > upper_bound)
        self.data['is_anomaly_iqr'] = anomalies
        
        count = anomalies.sum()
        percentage = (count / len(self.data)) * 100
        
        print(f"✓ Detected {count} anomalies ({percentage:.2f}%)")
        print(f"  Q1: {Q1:.2f}, Q3: {Q3:.2f}, IQR: {IQR:.2f}")
        print(f"  Bounds: [{lower_bound:.2f}, {upper_bound:.2f}]")
        
        self.results['iqr'] = {
            'count': count,
            'percentage': percentage,
            'bounds': (lower_bound, upper_bound)
        }
        
        return count
    
    def calculate_composite_score(self):
        """
        Calculate composite anomaly score based on all methods
        
        Combines results from all detection methods
        """
        print("\n--- Calculating Composite Anomaly Score ---")
        
        # Count how many methods flagged each point as anomaly
        anomaly_columns = [
            'is_anomaly_statistical',
            'is_anomaly_isolation_forest',
            'is_anomaly_zscore',
            'is_anomaly_iqr'
        ]
        
        self.data['anomaly_vote_count'] = self.data[anomaly_columns].sum(axis=1)
        
        # Normalize to 0-1 scale
        self.data['anomaly_score'] = self.data['anomaly_vote_count'] / len(anomaly_columns)
        
        # Mark as anomaly if majority of methods agree (>= 2 methods)
        self.data['is_anomaly_final'] = self.data['anomaly_vote_count'] >= 2
        
        final_count = self.data['is_anomaly_final'].sum()
        percentage = (final_count / len(self.data)) * 100
        
        print(f"✓ Final anomaly count: {final_count} ({percentage:.2f}%)")
        
        return final_count
    
    def print_summary(self):
        """Print detection summary"""
        print("\n" + "=" * 60)
        print("Anomaly Detection Summary")
        print("=" * 60)
        
        for method, result in self.results.items():
            print(f"\n{method.upper()}:")
            print(f"  Anomalies: {result['count']} ({result['percentage']:.2f}%)")
        
        if 'anomaly_vote_count' in self.data.columns:
            final_count = self.data['is_anomaly_final'].sum()
            final_pct = (final_count / len(self.data)) * 100
            print(f"\nFINAL CONSENSUS:")
            print(f"  Anomalies: {final_count} ({final_pct:.2f}%)")
    
    def save_results(self, output_file=OUTPUT_FILE):
        """Save detection results to CSV"""
        try:
            self.data.to_csv(output_file, index=False)
            print(f"\n✓ Results saved to: {output_file}")
        except Exception as e:
            print(f"✗ Error saving results: {e}")
    
    def run_all_detectors(self):
        """Run all anomaly detection methods"""
        print("\n" + "=" * 60)
        print("Running All Anomaly Detection Methods")
        print("=" * 60)
        
        if not self.load_data():
            return False
        
        # Run all detection methods
        self.detect_statistical(column='ldr_value')
        self.detect_isolation_forest(features=['ldr_value', 'pulse_count'])
        self.detect_zscore(column='ldr_value')
        self.detect_iqr(column='ldr_value')
        
        # Calculate composite score
        self.calculate_composite_score()
        
        # Print summary
        self.print_summary()
        
        # Save results
        self.save_results()
        
        return True


if __name__ == "__main__":
    detector = AnomalyDetector(INPUT_FILE)
    
    if detector.run_all_detectors():
        print("\n✓ Anomaly detection complete!")
        print("  Next step: Run visualization script")
    else:
        print("\n✗ Anomaly detection failed")