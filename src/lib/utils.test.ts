import { describe, it, expect } from 'vitest';
import { cn } from './utils';

describe('cn utility', () => {
  it('merges tailwind classes correctly', () => {
    expect(cn('px-2 py-2', 'p-4')).toBe('p-4');
  });

  it('handles conditional classes', () => {
    expect(cn('px-2', true && 'py-2', false && 'mt-4')).toBe('px-2 py-2');
  });

  it('handles undefined and null', () => {
    expect(cn('px-2', undefined, null)).toBe('px-2');
  });

  it('handles objects of classes', () => {
    expect(cn('base', { active: true, disabled: false })).toBe('base active');
  });
});
