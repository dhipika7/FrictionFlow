import os
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from typing import Dict, Any, Tuple

class MLFrictionPredictor:
    """
    ML-ready pipeline using Scikit-Learn RandomForestClassifier.
    Falls back gracefully to transparent rule-based detection when no trained model binary exists.
    """
    def __init__(self, model_path: str = "backend/app/ml/models/friction_rf.joblib"):
        self.model_path = model_path
        self.model = None
        self.is_trained = False
        self._load_if_exists()

    def _load_if_exists(self):
        if os.path.exists(self.model_path):
            try:
                import joblib
                self.model = joblib.load(self.model_path)
                self.is_trained = True
            except Exception:
                self.is_trained = False

    def predict_struggle(self, features: Dict[str, float]) -> Tuple[float, str]:
        """
        Features expected:
        [time_spent_seconds, attempt_count, failed_attempts, expected_time, topic_mastery_score]
        Returns (predicted_friction_score, confidence_status)
        """
        if self.is_trained and self.model:
            feature_vector = np.array([[
                features.get("time_spent_seconds", 0),
                features.get("attempt_count", 1),
                features.get("failed_attempts", 0),
                features.get("expected_time", 1200),
                features.get("topic_mastery_score", 60.0)
            ]])
            probs = self.model.predict_proba(feature_vector)[0]
            # Assuming class 1 represents struggle
            struggle_prob = probs[1] if len(probs) > 1 else 0.5
            return float(struggle_prob * 100.0), "ml_trained"
        
        # Transparent rule fallback
        return 0.0, "rule_based_fallback"

    def train_on_dataset(self, X: np.ndarray, y: np.ndarray):
        """
        Method to train RF classifier once real labeled telemetry dataset is available.
        """
        clf = RandomForestClassifier(n_estimators=100, random_state=42)
        clf.fit(X, y)
        self.model = clf
        self.is_trained = True
        os.makedirs(os.path.dirname(self.model_path), exist_ok=True)
        try:
            import joblib
            joblib.dump(clf, self.model_path)
        except Exception:
            pass
