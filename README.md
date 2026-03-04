# ExoDetect – Multi-Mission Exoplanet Classification System

A machine learning system for detecting and classifying exoplanets using combined data from NASA's Kepler and TESS space missions.

The project builds a unified machine learning pipeline capable of classifying transit signals into:

• False Positives  
• Candidate Planets  
• Confirmed Exoplanets

The system also includes a full-stack web interface that allows users to upload observational datasets and view prediction results with visualizations.

---

## Overview

Exoplanet detection is one of the most important challenges in modern astrophysics. Since planets are extremely faint compared to their host stars, astronomers often rely on the **transit method**, where a planet is inferred from small drops in stellar brightness.

However, astronomical datasets contain large amounts of **noise and false signals**, making classification difficult.

This project solves that problem by building a **mission-agnostic machine learning pipeline** trained on both **Kepler and TESS datasets**.

Unlike many previous models that perform binary classification, this system performs **three-class classification**, closer to real astronomical workflows.

---

## Key Features

• Unified machine learning pipeline for **Kepler + TESS data**

• Multi-class classification:
  - False Positive
  - Candidate Planet
  - Confirmed Exoplanet

• Multiple ML models implemented:
  - Random Forest
  - XGBoost
  - LightGBM

• Feature engineering and dataset harmonization across missions

• Full-stack web application for predictions

• Model explainability using feature importance analysis

• Interactive dashboard for predictions and performance metrics

---

## Dataset

Data used in this project comes from publicly available astronomical catalogs:

• NASA **Kepler Mission**
• NASA **TESS Mission**

After preprocessing and harmonization:

Dataset size: ~16,000+ samples

Features include:

• Orbital period  
• Transit duration  
• Transit depth  
• Stellar radius  
• Planet radius  
• Stellar temperature  
• Insolation flux  
• Derived feature ratios

Target Classes:

0 → False Positive  
1 → Candidate Planet  
2 → Confirmed Exoplanet

---

## Machine Learning Models

Three tree-based models were evaluated:

### Random Forest (Final Model)
n_estimators = 200
max_depth = 20
min_samples_split = 5
min_samples_leaf = 2
class_weight = balanced
Chosen because it performs well on **noisy and imbalanced astronomical datasets**.

### XGBoost

Gradient boosting model optimized for structured datasets.

### LightGBM

Efficient boosting model designed for large datasets.

---

## Model Performance

Dataset size: **16,719 samples**

Train/Test Split:
- Train: 13,375
- Test: 3,344

Performance:

Training Accuracy: ~0.77  
Test Accuracy: ~0.59  

Weighted F1 Score: ~0.59

Most important features:

1. Transit depth
2. Orbital period
3. Stellar radius

---

## System Architecture

Pipeline:
Kepler + TESS Data
↓
Data Cleaning & Feature Engineering
↓
Model Training (RF / XGBoost / LightGBM)
↓
Model Serialization (Joblib)
↓
Django Backend API
↓
React Frontend Dashboard
↓
User Uploads Dataset → Predictions

---

## Tech Stack

### Machine Learning
Python  
Scikit-Learn  
XGBoost  
LightGBM  
Pandas / NumPy

### Backend
Django REST API

### Frontend
React  
TypeScript  
Recharts (data visualization)

### Data Format
CSV input  
JSON API responses

---

## Features of Web Interface

• Upload CSV datasets for analysis  
• Generate predictions using ML models  
• View prediction results with confidence scores  
• Compare model performance  
• Visualize feature importance  

---

## Future Improvements

• Deep learning models on light-curve data  
• Domain adaptation across missions  
• Improved feature engineering  
• Cloud deployment  
• Integration with future missions (PLATO / Roman Space Telescope)

---

## References

NASA Exoplanet Archive  
Kepler Mission Dataset  
TESS Mission Dataset

---

## Contributors

Anshika Gupta, Hetanshi Vora, Soha Patel, Tanishka Shukla, Tasmiya Khan



