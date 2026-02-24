import { describe, it, expect } from 'vitest';
import { pad2, toLocalYMD } from './dateUtils';

describe('dateUtils', () => {
  describe('pad2', () => {
    it('should pad single digit numbers with zero', () => {
      expect(pad2(5)).toBe('05');
      expect(pad2('9')).toBe('09');
    });

    it('should not pad double digit numbers', () => {
      expect(pad2(10)).toBe('10');
      expect(pad2('25')).toBe('25');
    });
  });

  describe('toLocalYMD', () => {
    it('should return empty string for null or undefined', () => {
      expect(toLocalYMD(null)).toBe('');
      expect(toLocalYMD(undefined)).toBe('');
    });

    it('should return the same string if already in YMD format', () => {
      expect(toLocalYMD('2023-10-27')).toBe('2023-10-27');
    });

    it('should format Date objects to YMD', () => {
      const date = new Date(2023, 9, 27); // Month is 0-indexed, so 9 is October
      expect(toLocalYMD(date)).toBe('2023-10-27');
    });

    it('should handle ISO strings', () => {
      expect(toLocalYMD('2023-10-27T10:00:00Z')).toBe('2023-10-27');
    });

    it('should fallback to slice if data is invalid but string-like', () => {
      // This tests line 8: if (Number.isNaN(d.getTime())) return s.slice(0, 10);
      expect(toLocalYMD('InvalidDateString')).toBe('InvalidDat');
    });
  });
});
