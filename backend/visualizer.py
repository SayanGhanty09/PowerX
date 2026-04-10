"""
Smart Energy Monitoring System - Visualization Module

This script creates comprehensive visualizations of energy data
and highlights detected anomalies.

Features:
- Time series plots with anomaly highlighting
- Multi-panel dashboard
- Statistical distribution plots
- Anomaly score visualization
- Export to PNG/PDF

Author: Smart Energy System
Date: 2026
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from datetime import datetime
import os

# Set style
sns.set_style("whitegrid")
plt.rcParams['figure.figsize'] = (16, 10)
plt.rcParams['font.size'] = 10

# ==================== CONFIGURATION ====================
INPUT_FILE = "data/anomalies_detected.csv"
OUTPUT_DIR = "results"
PLOT_FILE = os.path.join(OUTPUT_DIR, "anomaly_visualization.png")


class EnergyDataVisualizer:
    """Visualization for energy monitoring and anomaly detection"""
    
    def __init__(self, data_file):
        """
        Initialize visualizer
        
        Args:
            data_file (str): Path to data with anomaly labels
        """
        self.data_file = data_file
        self.data = None
        
        # Create output directory
        if not os.path.exists(OUTPUT_DIR):
            os.makedirs(OUTPUT_DIR)
    
    def load_data(self):
        """Load data with anomaly detection results"""
        try:
            self.data = pd.read_csv(self.data_file)
            print(f"✓ Loaded {len(self.data)} records")
            
            # Convert timestamp if exists
            if 'timestamp' in self.data.columns:
                try:
                    self.data['timestamp'] = pd.to_datetime(self.data['timestamp'])
                except:
                    pass
            
            return True
        except Exception as e:
            print(f"✗ Error loading data: {e}")
            return False
    
    def plot_time_series_with_anomalies(self, ax, column='ldr_value', 
                                       anomaly_column='is_anomaly_final'):
        """
        Plot time series with anomalies highlighted
        
        Args:
            ax: Matplotlib axis
            column (str): Data column to plot
            anomaly_column (str): Anomaly flag column
        """
        # Create index for x-axis
        x = np.arange(len(self.data))
        
        # Plot normal data
        normal_mask = ~self.data[anomaly_column]
        ax.plot(x[normal_mask], self.data.loc[normal_mask, column], 
                'b-', linewidth=1, label='Normal', alpha=0.7)
        
        # Plot anomalies
        anomaly_mask = self.data[anomaly_column]
        if anomaly_mask.sum() > 0:
            ax.scatter(x[anomaly_mask], self.data.loc[anomaly_mask, column],
                      color='red', s=100, marker='o', label='Anomaly', 
                      zorder=5, edgecolors='darkred', linewidths=2)
        
        ax.set_xlabel('Sample Index')
        ax.set_ylabel(column.replace('_', ' ').title())
        ax.set_title(f'{column.replace("_", " ").title()} - Time Series with Anomalies')
        ax.legend()
        ax.grid(True, alpha=0.3)
    
    def plot_smoothed_comparison(self, ax):
        """
        Compare original vs smoothed data
        
        Args:
            ax: Matplotlib axis
        """
        x = np.arange(len(self.data))
        
        if 'ldr_value' in self.data.columns:
            ax.plot(x, self.data['ldr_value'], 'b-', 
                   linewidth=0.5, alpha=0.5, label='Original')
        
        if 'ldr_value_smoothed' in self.data.columns:
            ax.plot(x, self.data['ldr_value_smoothed'], 'g-', 
                   linewidth=2, label='Smoothed')
        
        ax.set_xlabel('Sample Index')
        ax.set_ylabel('LDR Value')
        ax.set_title('Original vs Smoothed Data')
        ax.legend()
        ax.grid(True, alpha=0.3)
    
    def plot_pulse_analysis(self, ax):
        """
        Plot pulse count analysis
        
        Args:
            ax: Matplotlib axis
        """
        x = np.arange(len(self.data))
        
        if 'pulse_count' in self.data.columns:
            ax.plot(x, self.data['pulse_count'], 'purple', linewidth=2)
            
            # Mark anomalies
            if 'is_anomaly_final' in self.data.columns:
                anomaly_mask = self.data['is_anomaly_final']
                if anomaly_mask.sum() > 0:
                    ax.scatter(x[anomaly_mask], 
                             self.data.loc[anomaly_mask, 'pulse_count'],
                             color='red', s=100, marker='x', 
                             label='Anomaly', zorder=5)
        
        ax.set_xlabel('Sample Index')
        ax.set_ylabel('Pulse Count')
        ax.set_title('Cumulative Pulse Count')
        ax.legend()
        ax.grid(True, alpha=0.3)
    
    def plot_anomaly_scores(self, ax):
        """
        Plot anomaly scores
        
        Args:
            ax: Matplotlib axis
        """
        x = np.arange(len(self.data))
        
        if 'anomaly_score' in self.data.columns:
            # Plot as bar chart with color coding
            colors = ['red' if score > 0.5 else 'orange' if score > 0.25 else 'green' 
                     for score in self.data['anomaly_score']]
            
            ax.bar(x, self.data['anomaly_score'], color=colors, alpha=0.6)
            ax.axhline(y=0.5, color='red', linestyle='--', 
                      linewidth=2, label='High Risk Threshold')
            
        ax.set_xlabel('Sample Index')
        ax.set_ylabel('Anomaly Score')
        ax.set_title('Composite Anomaly Score (Multi-Method Consensus)')
        ax.set_ylim([0, 1])
        ax.legend()
        ax.grid(True, alpha=0.3)
    
    def plot_distribution(self, ax, column='ldr_value'):
        """
        Plot data distribution with anomaly regions
        
        Args:
            ax: Matplotlib axis
            column (str): Column to analyze
        """
        if column not in self.data.columns:
            return
        
        # Plot histogram
        normal_data = self.data[~self.data['is_anomaly_final']][column]
        anomaly_data = self.data[self.data['is_anomaly_final']][column]
        
        ax.hist(normal_data, bins=50, alpha=0.7, color='blue', 
               label='Normal', edgecolor='black')
        
        if len(anomaly_data) > 0:
            ax.hist(anomaly_data, bins=20, alpha=0.7, color='red', 
                   label='Anomaly', edgecolor='darkred')
        
        # Add statistical lines
        mean = self.data[column].mean()
        std = self.data[column].std()
        
        ax.axvline(mean, color='green', linestyle='--', 
                  linewidth=2, label=f'Mean: {mean:.2f}')
        ax.axvline(mean + 2*std, color='orange', linestyle='--', 
                  linewidth=2, label=f'+2σ: {mean + 2*std:.2f}')
        ax.axvline(mean - 2*std, color='orange', linestyle='--', 
                  linewidth=2, label=f'-2σ: {mean - 2*std:.2f}')
        
        ax.set_xlabel(column.replace('_', ' ').title())
        ax.set_ylabel('Frequency')
        ax.set_title(f'{column.replace("_", " ").title()} Distribution')
        ax.legend()
        ax.grid(True, alpha=0.3)
    
    def plot_method_comparison(self, ax):
        """
        Compare different anomaly detection methods
        
        Args:
            ax: Matplotlib axis
        """
        methods = {
            'Statistical': 'is_anomaly_statistical',
            'Isolation Forest': 'is_anomaly_isolation_forest',
            'Z-Score': 'is_anomaly_zscore',
            'IQR': 'is_anomaly_iqr',
            'Final Consensus': 'is_anomaly_final'
        }
        
        counts = []
        labels = []
        colors = ['skyblue', 'lightgreen', 'lightcoral', 'lightyellow', 'red']
        
        for label, column in methods.items():
            if column in self.data.columns:
                count = self.data[column].sum()
                counts.append(count)
                labels.append(f'{label}\n({count})')
        
        ax.bar(range(len(counts)), counts, color=colors[:len(counts)], 
              edgecolor='black', linewidth=2)
        ax.set_xticks(range(len(labels)))
        ax.set_xticklabels(labels, rotation=15, ha='right')
        ax.set_ylabel('Number of Anomalies')
        ax.set_title('Anomaly Detection Methods Comparison')
        ax.grid(True, alpha=0.3, axis='y')
    
    def create_dashboard(self):
        """Create comprehensive visualization dashboard"""
        print("\n--- Creating Visualization Dashboard ---")
        
        # Create figure with subplots
        fig = plt.figure(figsize=(18, 12))
        
        # Define grid
        gs = fig.add_gridspec(3, 3, hspace=0.3, wspace=0.3)
        
        # Plot 1: LDR time series with anomalies (large)
        ax1 = fig.add_subplot(gs[0, :])
        self.plot_time_series_with_anomalies(ax1, 'ldr_value', 'is_anomaly_final')
        
        # Plot 2: Smoothed comparison
        ax2 = fig.add_subplot(gs[1, 0])
        self.plot_smoothed_comparison(ax2)
        
        # Plot 3: Pulse analysis
        ax3 = fig.add_subplot(gs[1, 1])
        self.plot_pulse_analysis(ax3)
        
        # Plot 4: Anomaly scores
        ax4 = fig.add_subplot(gs[1, 2])
        self.plot_anomaly_scores(ax4)
        
        # Plot 5: Distribution
        ax5 = fig.add_subplot(gs[2, 0])
        self.plot_distribution(ax5, 'ldr_value')
        
        # Plot 6: Method comparison
        ax6 = fig.add_subplot(gs[2, 1:])
        self.plot_method_comparison(ax6)
        
        # Add title
        fig.suptitle('Smart Energy Monitoring - Anomaly Detection Dashboard', 
                    fontsize=16, fontweight='bold', y=0.995)
        
        # Save figure
        plt.savefig(PLOT_FILE, dpi=300, bbox_inches='tight')
        print(f"✓ Dashboard saved to: {PLOT_FILE}")
        
        # Display
        plt.show()
    
    def create_simple_plot(self):
        """Create simple plot for quick visualization"""
        print("\n--- Creating Simple Visualization ---")
        
        fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(14, 10))
        
        # Plot 1: LDR with anomalies
        self.plot_time_series_with_anomalies(ax1, 'ldr_value', 'is_anomaly_final')
        
        # Plot 2: Pulse count with anomalies
        self.plot_time_series_with_anomalies(ax2, 'pulse_count', 'is_anomaly_final')
        
        plt.tight_layout()
        
        simple_file = os.path.join(OUTPUT_DIR, "simple_plot.png")
        plt.savefig(simple_file, dpi=200, bbox_inches='tight')
        print(f"✓ Plot saved to: {simple_file}")
        
        plt.show()


def generate_sample_data():
    """Generate sample data for testing visualization"""
    print("Generating sample data for testing...")
    
    np.random.seed(42)
    n_samples = 200
    
    # Generate normal data
    ldr_values = np.random.normal(2000, 300, n_samples)
    pulse_counts = np.cumsum(np.random.poisson(5, n_samples))
    
    # Add some anomalies
    anomaly_indices = np.random.choice(n_samples, 20, replace=False)
    ldr_values[anomaly_indices] += np.random.choice([-1000, 1000], 20)
    
    # Create DataFrame
    data = pd.DataFrame({
        'timestamp': pd.date_range('2026-01-01', periods=n_samples, freq='5min'),
        'ldr_value': ldr_values,
        'pulse_count': pulse_counts,
        'ldr_value_smoothed': pd.Series(ldr_values).rolling(5, center=True).mean(),
        'is_anomaly_statistical': False,
        'is_anomaly_isolation_forest': False,
        'is_anomaly_zscore': False,
        'is_anomaly_iqr': False,
        'is_anomaly_final': False,
        'anomaly_score': 0.0
    })
    
    # Mark anomalies
    data.loc[anomaly_indices, 'is_anomaly_final'] = True
    data.loc[anomaly_indices, 'anomaly_score'] = np.random.uniform(0.6, 1.0, len(anomaly_indices))
    
    # Fill NaN in smoothed
    data['ldr_value_smoothed'].fillna(method='bfill', inplace=True)
    data['ldr_value_smoothed'].fillna(method='ffill', inplace=True)
    
    # Save
    os.makedirs('data', exist_ok=True)
    data.to_csv('data/anomalies_detected.csv', index=False)
    print(f"✓ Sample data created with {len(anomaly_indices)} anomalies")


if __name__ == "__main__":
    # Check if data exists, if not generate sample
    if not os.path.exists(INPUT_FILE):
        print(f"⚠ Data file not found: {INPUT_FILE}")
        choice = input("Generate sample data? (y/n): ")
        if choice.lower() == 'y':
            generate_sample_data()
        else:
            print("Exiting...")
            exit()
    
    # Create visualizer
    visualizer = EnergyDataVisualizer(INPUT_FILE)
    
    if visualizer.load_data():
        # Choose visualization type
        choice = input("\nVisualization type:\n1. Full Dashboard\n2. Simple Plot\nChoice (1/2): ")
        
        if choice == "1":
            visualizer.create_dashboard()
        else:
            visualizer.create_simple_plot()
    else:
        print("✗ Visualization failed")