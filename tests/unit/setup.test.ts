import { describe, it, expect } from 'vitest';

describe('Project Setup', () => {
  it('should have basic test infrastructure working', () => {
    expect(true).toBe(true);
  });

  it('should be able to import from src directory', async () => {
    const { UTILS_PLACEHOLDER } = await import('@/utils');
    expect(UTILS_PLACEHOLDER).toBe(true);
  });
});
