import { firstCharToLocaleUpperCase } from './first-char-to-locale-upper-case.util';

describe('firstCharToLocaleUpperCase', () => {
  it('should capitalize the first character of a lowercase string', () => {
    expect(firstCharToLocaleUpperCase('hello')).toBe('Hello');
  });

  it('should keep the first character capitalized if already uppercase', () => {
    expect(firstCharToLocaleUpperCase('World')).toBe('World');
  });

  it('should handle single character strings', () => {
    expect(firstCharToLocaleUpperCase('a')).toBe('A');
    expect(firstCharToLocaleUpperCase('Z')).toBe('Z');
  });

  it('should handle empty strings', () => {
    expect(firstCharToLocaleUpperCase('')).toBe('');
  });

  it('should preserve the rest of the string unchanged', () => {
    expect(firstCharToLocaleUpperCase('hELLO wORLD')).toBe('HELLO wORLD');
  });

  it('should handle strings with numbers', () => {
    expect(firstCharToLocaleUpperCase('123abc')).toBe('123abc');
  });

  it('should handle strings with special characters', () => {
    expect(firstCharToLocaleUpperCase('!hello')).toBe('!hello');
    expect(firstCharToLocaleUpperCase('@world')).toBe('@world');
  });

  it('should handle locale-specific characters correctly', () => {
    expect(firstCharToLocaleUpperCase('istanbul')).toBe('Istanbul');
    expect(firstCharToLocaleUpperCase('école')).toBe('École');
    expect(firstCharToLocaleUpperCase('ñoño')).toBe('Ñoño');
  });

  it('should handle strings with whitespace at the start', () => {
    expect(firstCharToLocaleUpperCase(' hello')).toBe(' hello');
  });

  it('should handle strings with only whitespace', () => {
    expect(firstCharToLocaleUpperCase('   ')).toBe('   ');
  });
});
