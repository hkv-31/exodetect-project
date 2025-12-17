# fix_models_final.py
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
import joblib
import os
import sys

print("=" * 70)
print(" CREATING 3-CLASS MODEL FROM YOUR DATA")
print("=" * 70)

# Load your data
df = pd.read_csv('unified_complete_dataset.csv')
print(f" Loaded {len(df):,} rows")

# Find feature columns
period_col = 'period' if 'period' in df.columns else next((col for col in df.columns if 'period' in col.lower()), 'period')
depth_col = 'depth' if 'depth' in df.columns else next((col for col in df.columns if 'depth' in col.lower()), 'depth')
radius_col = 'stellar_radius'  # From your output

print(f" Using columns:")
print(f"   Period: {period_col}")
print(f"   Depth: {depth_col}")
print(f"   Radius: {radius_col}")

# Prepare features
X = df[[period_col, depth_col, radius_col]].fillna(0)

# Prepare labels - use disposition_encoded
y = df['disposition_encoded']

print(f"\n Label distribution:")
print(f"   FALSE_POSITIVE (0): {sum(y == 0):,} rows")
print(f"   CANDIDATE (1): {sum(y == 1):,} rows")
print(f"   CONFIRMED (2): {sum(y == 2):,} rows")
print(f"   Total: {len(y):,} rows")

# Train 3-class model
print(f"\n Training Random Forest model...")
model = RandomForestClassifier(
    n_estimators=100,
    max_depth=20,
    min_samples_split=5,
    min_samples_leaf=2,
    class_weight='balanced',  # Important for imbalanced data
    random_state=42,
    n_jobs=-1
)

model.fit(X, y)
print(f" Model trained successfully!")

# Test predictions
print(f"\n Testing model with sample data...")
test_samples = pd.DataFrame({
    period_col: [10.0, 365.0, 0.8, 0.05, 1000.0],
    depth_col: [0.02, 0.01, 0.001, 0.00001, 0.0001],
    radius_col: [1.0, 11.0, 0.3, 0.1, 0.2]
})

predictions = model.predict(test_samples)
probabilities = model.predict_proba(test_samples)

labels = {0: 'FALSE_POSITIVE', 1: 'CANDIDATE', 2: 'CONFIRMED'}
print("Sample predictions:")
for i, (pred, probs) in enumerate(zip(predictions, probabilities)):
    print(f"  Sample {i+1}: {labels[pred]} (confidence: {probs[pred]:.3f})")

# Save the model
print(f"\n Saving model...")

# Save in current directory
model_path_simple = '3_class_trained_model.pkl'
joblib.dump(model, model_path_simple)
print(f" Model saved to: {model_path_simple}")

# Also save to Django ml_models folder
try:
    # Go up a few directories to find Django project
    current_dir = os.getcwd()
    
    # Try different possible paths
    possible_paths = [
        os.path.join(current_dir, 'ml_models'),
        os.path.join(current_dir, '..', 'ml_models'),
        os.path.join(current_dir, '..', '..', 'ml_models'),
        os.path.join(current_dir, 'detection_api', 'ml_models'),
        os.path.join(current_dir, '..', 'detection_api', 'ml_models')
    ]
    
    for path in possible_paths:
        if os.path.exists(path):
            django_model_path = os.path.join(path, '3_class_trained_model.pkl')
            joblib.dump(model, django_model_path)
            print(f" Also saved to Django folder: {django_model_path}")
            break
except Exception as e:
    print(f" Could not save to Django folder: {e}")

# Create a simple test CSV with correct column names
print(f"\n Creating test CSV...")

# Create test data with correct column names
test_df = df[[period_col, depth_col, radius_col, 'disposition']].copy()

# Rename to match what Django expects
test_df = test_df.rename(columns={
    period_col: 'period',
    depth_col: 'depth',
    radius_col: 'radius'
})

test_df.to_csv('test_with_3class_model.csv', index=False)
print(f" Created test file: test_with_3class_model.csv")
print(f"   Columns: {list(test_df.columns)}")
print(f"   CONFIRMED count: {sum(test_df['disposition'] == 'CONFIRMED'):,}")

print("\n" + "=" * 70)
print(" 3-CLASS MODEL CREATED SUCCESSFULLY!")
print("=" * 70)