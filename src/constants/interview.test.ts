import { describe, it, expect } from 'vitest';
import { SYSTEM_INSTRUCTION } from './interview';

describe('SYSTEM_INSTRUCTION', () => {
  it('should contain the role definition', () => {
    expect(SYSTEM_INSTRUCTION).toContain('You are a precise, analytical and professional interviewer');
  });

  it('should contain the instruction for 7 questions', () => {
    expect(SYSTEM_INSTRUCTION).toContain('7 questions');
  });

  it('should contain the Turners values', () => {
    expect(SYSTEM_INSTRUCTION).toContain('Customer Driven');
    expect(SYSTEM_INSTRUCTION).toContain('One Team');
    expect(SYSTEM_INSTRUCTION).toContain('Do the right thing');
    expect(SYSTEM_INSTRUCTION).toContain('Passion');
  });

  it('should specify New Zealand English', () => {
    expect(SYSTEM_INSTRUCTION).toContain('New Zealand English');
  });
});
