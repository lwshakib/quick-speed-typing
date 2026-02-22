/**
 * WPM Formula: ((correct_chars / 5) / (seconds / 60))
 * Accounts for standard word length (5 characters).
 */
export const calculateWPM = (correctChars: number, seconds: number): number => {
  if (seconds <= 0) return 0;
  const minutes = seconds / 60;
  const wordsTyped = correctChars / 5;
  return Math.round(wordsTyped / minutes);
};

/**
 * Raw WPM Formula: ((total_chars_including_errors / 5) / (seconds / 60))
 * Measures pure typing speed regardless of accuracy.
 */
export const calculateRawWPM = (totalChars: number, seconds: number): number => {
  if (seconds <= 0) return 0;
  const minutes = seconds / 60;
  const wordsTyped = totalChars / 5;
  return Math.round(wordsTyped / minutes);
};

/**
 * Accuracy Formula: ((total_typed - errors) / total_typed) * 100
 */
export const calculateAccuracy = (totalTypedCount: number, errors: number): number => {
  if (totalTypedCount <= 0) return 0;
  return Math.max(0, Math.round(((totalTypedCount - errors) / totalTypedCount) * 100));
};

/**
 * Consistency calculation based on speed variance over time.
 * High consistency means the typist maintained a steady pace.
 */
export const calculateConsistency = (wpms: number[]): number => {
  if (wpms.length < 2) return 100;
  const avg = wpms.reduce((a, b) => a + b, 0) / wpms.length;
  if (avg === 0) return 100;
  const variance = wpms.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / wpms.length;
  const stdDev = Math.sqrt(variance);
  // Lower relative deviation = higher consistency
  const cons = Math.max(0, Math.min(100, Math.round(100 - (stdDev / avg) * 100)));
  return cons;
};
