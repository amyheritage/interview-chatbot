import { describe, it, expect } from 'vitest';
import { formatScore, validateInput } from './interviewUtils';

describe('interviewUtils', () => {
  describe('formatScore', () => {
    it('formats a valid score', () => {
      expect(formatScore(4)).toBe('4/5');
    });

    it('rounds a decimal score', () => {
      expect(formatScore(3.7)).toBe('4/5');
    });

    it('caps score at 5', () => {
      expect(formatScore(6)).toBe('5/5');
    });

    it('floors score at 0', () => {
      expect(formatScore(-1)).toBe('0/5');
    });
  });

  describe('validateInput', () => {
    it('returns true for input >= 10 characters', () => {
      expect(validateInput('This is a long enough answer.')).toBe(true);
    });

    it('returns false for input < 10 characters', () => {
      expect(validateInput('Too short')).toBe(false);
    });

    it('handles whitespace correctly', () => {
      expect(validateInput('   short   ')).toBe(false);
    });
  });
});
