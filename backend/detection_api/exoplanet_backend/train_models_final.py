# train_3_class_model.py
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import classification_report, confusion_matrix
import joblib
import os
import warnings
warnings.filterwarnings('ignore')

print("=" * 70)
print(" TRAINING 3-CLASS EXOPLANET MODEL")
print("=" * 70)

# Load your dataset
print(" Loading dataset...")
try:
    df = pd.read_csv('unified_complete_dataset.csv')
    print(f" Loaded dataset with {len(df):,} rows and {len(df.columns)} columns")
except:
    # Try to find your dataset
    import glob
    csv_files = glob.glob('*.csv')
    if csv_files:
        print(f"Found CSV files: {csv_files}")
        df = pd.read_csv(csv_files[0])
    else:
        raise FileNotFoundError("Could not find your dataset. Please update the file path.")

# Show columns
print(f"\n Available columns:")
for col in df.columns:
    print(f"  - {col}")

# Prepare features
print(f"\n Preparing features...")
feature_columns = []

# Find period column
period_cols = [col for col in df.columns if 'period' in col.lower()]
if period_cols:
    period_col = period_cols[0]
    print(f"  Using '{period_col}' for period")
    feature_columns.append(period_col)
else:
    print(" No period column found!")
    exit(1)

# Find depth column  
depth_cols = [col for col in df.columns if 'depth' in col.lower()]
if depth_cols:
    depth_col = depth_cols[0]
    print(f"  Using '{depth_col}' for depth")
    feature_columns.append(depth_col)
else:
    print(" No depth column found!")
    exit(1)

# Find radius column
radius_cols = [col for col in df.columns if 'radius' in col.lower()]
if radius_cols:
    radius_col = radius_cols[0]
    print(f"  Using '{radius_col}' for radius")
    feature_columns.append(radius_col)
else:
    # Try alternative names
    alt_radius = [col for col in df.columns if any(word in col.lower() for word in ['rade', 'radj', 'prad', 'size'])]
    if alt_radius:
        radius_col = alt_radius[0]
        print(f"  Using '{radius_col}' for radius")
        feature_columns.append(radius_col)
    else:
        print(" No radius column found!")
        exit(1)

# Create feature matrix
X = df[feature_columns].copy()
print(f"\n Features shape: {X.shape}")

# Handle missing values
for col in feature_columns:
    missing = X[col].isna().sum()
    if missing > 0:
        print(f"  Filling {missing} missing values in '{col}' with median")
        X[col].fillna(X[col].median(), inplace=True)

# Prepare labels
print(f"\n Preparing labels...")

# Option 1: Use disposition_encoded if available
if 'disposition_encoded' in df.columns:
    y = df['disposition_encoded'].copy()
    print(f"  Using 'disposition_encoded' column")
    
# Option 2: Use koi_disposition
elif 'koi_disposition' in df.columns:
    print(f"  Converting 'koi_disposition' to numeric labels")
    def map_disposition(label):
        label = str(label).upper().strip()
        if 'FALSE' in label or label in ['0', '0.0', 'FP']:
            return 0
        elif 'CANDIDATE' in label or label in ['1', '1.0', 'CAND']:
            return 1
        elif 'CONFIRMED' in label or label in ['2', '2.0', 'EXOPLANET']:
            return 2
        else:
            return 1  # Default to candidate
    
    y = df['koi_disposition'].apply(map_disposition)
    
# Option 3: Use disposition
elif 'disposition' in df.columns:
    print(f"  Converting 'disposition' to numeric labels")
    def map_disposition(label):
        label = str(label).upper().strip()
        if 'FALSE' in label:
            return 0
        elif 'CANDIDATE' in label:
            return 1
        elif 'CONFIRMED' in label:
            return 2
        else:
            return 1
    
    y = df['disposition'].apply(map_disposition)
    
else:
    print(" No label column found! Looking for:")
    print("   - disposition_encoded")
    print("   - koi_disposition") 
    print("   - disposition")
    print("   - label, class, target")
    
    # Try to find any label column
    label_cols = [col for col in df.columns if any(word in col.lower() for word in ['label', 'class', 'target', 'disposition'])]
    if label_cols:
        print(f"\nFound possible label columns: {label_cols}")
        # Try the first one
        label_col = label_cols[0]
        print(f"Trying to use '{label_col}'...")
        
        def guess_label(val):
            val_str = str(val).upper()
            if 'FALSE' in val_str or '0' in val_str:
                return 0
            elif 'CONFIRMED' in val_str or '2' in val_str:
                return 2
            elif 'CANDIDATE' in val_str or '1' in val_str:
                return 1
            else:
                # Try to infer from value
                try:
                    num = float(val)
                    if num == 0:
                        return 0
                    elif num == 1:
                        return 1
                    elif num == 2:
                        return 2
                    else:
                        return int(num % 3)  # Wrap to 0,1,2
                except:
                    return 1  # Default to candidate
        
        y = df[label_col].apply(guess_label)
    else:
        raise ValueError("No suitable label column found!")

# Check label distribution
print(f"\n Label distribution:")
unique_labels, counts = np.unique(y, return_counts=True)
for label, count in zip(unique_labels, counts):
    percentage = (count / len(y)) * 100
    label_name = {0: 'FALSE_POSITIVE', 1: 'CANDIDATE', 2: 'CONFIRMED'}.get(int(label), f'UNKNOWN_{label}')
    print(f"  {label_name} ({label}): {count:,} rows ({percentage:.1f}%)")

# Train/test split
print(f"\n Training model...")
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
print(f"  Training set: {len(X_train):,} rows")
print(f"  Test set: {len(X_test):,} rows")

# Train Random Forest (good for imbalanced data)
model = RandomForestClassifier(
    n_estimators=200,
    max_depth=20,
    min_samples_split=5,
    min_samples_leaf=2,
    class_weight='balanced',  # Important for imbalanced data
    random_state=42,
    n_jobs=-1  # Use all CPU cores
)

model.fit(X_train, y_train)
print(f" Model trained successfully!")

# Evaluate
print(f"\n Model evaluation:")
train_score = model.score(X_train, y_train)
test_score = model.score(X_test, y_test)
print(f"  Training accuracy: {train_score:.3f}")
print(f"  Test accuracy: {test_score:.3f}")

# Cross-validation
cv_scores = cross_val_score(model, X, y, cv=5, n_jobs=-1)
print(f"  Cross-validation scores: {cv_scores}")
print(f"  CV mean: {cv_scores.mean():.3f} (+/- {cv_scores.std() * 2:.3f})")

# Detailed classification report
y_pred = model.predict(X_test)
print(f"\n Classification Report:")
print(classification_report(y_test, y_pred, target_names=['FALSE_POSITIVE', 'CANDIDATE', 'CONFIRMED']))

# Confusion matrix
print(f" Confusion Matrix:")
cm = confusion_matrix(y_test, y_pred)
cm_df = pd.DataFrame(cm, 
                     index=['Actual FP', 'Actual CAND', 'Actual CONF'],
                     columns=['Pred FP', 'Pred CAND', 'Pred CONF'])
print(cm_df)

# Check feature importance
print(f"\n Feature Importance:")
for col, importance in zip(feature_columns, model.feature_importances_):
    print(f"  {col}: {importance:.3f}")

# Save the model
print(f"\n Saving model...")
model_dir = 'detection_api/ml_models'
os.makedirs(model_dir, exist_ok=True)

model_path = os.path.join(model_dir, '3_class_exoplanet_model.pkl')
joblib.dump(model, model_path)
print(f" Model saved to: {model_path}")
print(f" File size: {os.path.getsize(model_path):,} bytes")

# Also save as joblib (more reliable)
joblib_path = os.path.join(model_dir, '3_class_exoplanet_model.joblib')
joblib.dump(model, joblib_path)
print(f" Also saved as joblib: {joblib_path}")

# Create a test prediction to verify
print(f"\n Testing model with sample data...")
test_samples = pd.DataFrame({
    feature_columns[0]: [10.5, 365.0, 0.8, 100.0],
    feature_columns[1]: [0.02, 0.01, 0.001, 0.0001],
    feature_columns[2]: [1.0, 11.0, 0.5, 0.2]
})

predictions = model.predict(test_samples)
probabilities = model.predict_proba(test_samples)

print("Sample predictions:")
for i, (pred, probs) in enumerate(zip(predictions, probabilities)):
    label_name = {0: 'FALSE_POSITIVE', 1: 'CANDIDATE', 2: 'CONFIRMED'}[pred]
    print(f"  Sample {i+1}: {label_name} (confidence: {probs[pred]:.3f})")
    print(f"     Probabilities: FP={probs[0]:.3f}, CAND={probs[1]:.3f}, CONF={probs[2]:.3f}")

print("\n" + "=" * 70)
print(" 3-CLASS MODEL TRAINING COMPLETE!")
print("=" * 70)
print("\n NEXT STEPS:")
print("1. Restart your Django server")
print("2. Upload your 16,000 row CSV")
print("3. Select '3 Class Exoplanet Model' from the model dropdown")
print("4. You should now see non-zero CONFIRMED predictions!")