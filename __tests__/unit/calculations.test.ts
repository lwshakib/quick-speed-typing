import {
  calculateWPM,
  calculateRawWPM,
  calculateAccuracy,
  calculateConsistency,
} from '@/lib/calculations';

describe('Calculations Library', () => {
  describe('calculateWPM', () => {
    it('calculates WPM correctly for standard input', () => {
      // 100 characters in 60 seconds = 20 words / 1 min = 20 WPM
      expect(calculateWPM(100, 60)).toBe(20);
    });

    it('handles zero seconds gracefully', () => {
      expect(calculateWPM(100, 0)).toBe(0);
    });

    it('calculates WPM correctly for shorter durations', () => {
      // 25 characters in 15 seconds = 5 words / 0.25 min = 20 WPM
      expect(calculateWPM(25, 15)).toBe(20);
    });
  });

  describe('calculateRawWPM', () => {
    it('calculates raw WPM including errors', () => {
      // 120 total characters in 60 seconds = 24 words / 1 min = 24 Raw WPM
      expect(calculateRawWPM(120, 60)).toBe(24);
    });

    it('handles zero seconds gracefully', () => {
      expect(calculateRawWPM(120, 0)).toBe(0);
    });
  });

  describe('calculateAccuracy', () => {
    it('calculates 100% accuracy for zero errors', () => {
      expect(calculateAccuracy(100, 0)).toBe(100);
    });

    it('calculates 50% accuracy for half errors', () => {
      expect(calculateAccuracy(100, 50)).toBe(50);
    });

    it('calculates 0% accuracy for more errors than typed characters', () => {
      expect(calculateAccuracy(50, 60)).toBe(0);
    });

    it('handles zero typed characters gracefully', () => {
      expect(calculateAccuracy(0, 0)).toBe(0);
    });
  });

  describe('calculateConsistency', () => {
    it('returns 100% consistency for single test', () => {
      expect(calculateConsistency([100])).toBe(100);
    });

    it('returns 100% consistency for perfectly steady speed', () => {
      expect(calculateConsistency([80, 80, 80, 80])).toBe(100);
    });

    it('returns high consistency for small variations', () => {
      const consistency = calculateConsistency([100, 102, 98, 100]);
      expect(consistency).toBeGreaterThan(90);
    });

    it('returns low consistency for high variations', () => {
      const consistency = calculateConsistency([100, 20, 180, 50]);
      expect(consistency).toBeLessThan(50);
    });

    it('handles empty array gracefully', () => {
      expect(calculateConsistency([])).toBe(100);
    });

    it('handles zero average gracefully', () => {
      expect(calculateConsistency([0, 0, 0])).toBe(100);
    });
  });
});
