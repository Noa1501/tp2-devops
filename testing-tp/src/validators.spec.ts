import { isValidEmail, isValidPassword, isValidAge } from './validators';

describe('isValidEmail', () => {
  it('should return true for a valid email', () => {
    expect(isValidEmail('user@example.com')).toBe(true);
  });

  it('should return true for an email with dots and tags', () => {
    expect(isValidEmail('user.name+tag@domain.co')).toBe(true);
  });

  it('should return false for an email without @', () => {
    expect(isValidEmail('invalid')).toBe(false);
  });

  it('should return false when @ is at the start', () => {
    expect(isValidEmail('@domain.com')).toBe(false);
  });

  it('should return false when there is nothing after @', () => {
    expect(isValidEmail('user@')).toBe(false);
  });

  it('should return false for empty string', () => {
    expect(isValidEmail('')).toBe(false);
  });

  it('should return false for null', () => {
    expect(isValidEmail(null)).toBe(false);
  });
});

describe('isValidPassword', () => {
  it('should return valid true for a strong password', () => {
    const result = isValidPassword('Passw0rd!');
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should return multiple errors for a short weak password', () => {
    const result = isValidPassword('short');
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(1);
  });

  it('should return error when uppercase is missing', () => {
    const result = isValidPassword('alllowercase1!');
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Au moins 1 majuscule requise');
  });

  it('should return error when lowercase is missing', () => {
    const result = isValidPassword('ALLUPPERCASE1!');
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Au moins 1 minuscule requise');
  });

  it('should return error when digit is missing', () => {
    const result = isValidPassword('NoDigits!here');
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Au moins 1 chiffre requis');
  });

  it('should return error when special character is missing', () => {
    const result = isValidPassword('NoSpecial1here');
    expect(result.valid).toBe(false);
    expect(result.errors).toContain(
      'Au moins 1 caractère spécial requis (!@#$%^&*)',
    );
  });

  it('should return all errors for empty string', () => {
    const result = isValidPassword('');
    expect(result.valid).toBe(false);
    expect(result.errors).toHaveLength(5);
  });

  it('should return all errors for null', () => {
    const result = isValidPassword(null);
    expect(result.valid).toBe(false);
    expect(result.errors).toHaveLength(5);
  });

  it('should return error when password is too short', () => {
    const result = isValidPassword('Ab1!');
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Minimum 8 caractères requis');
  });
});

describe('isValidAge', () => {
  it('should return true for age 25', () => {
    expect(isValidAge(25)).toBe(true);
  });

  it('should return true for age 0', () => {
    expect(isValidAge(0)).toBe(true);
  });

  it('should return true for age 150', () => {
    expect(isValidAge(150)).toBe(true);
  });

  it('should return false for negative age', () => {
    expect(isValidAge(-1)).toBe(false);
  });

  it('should return false for age above 150', () => {
    expect(isValidAge(151)).toBe(false);
  });

  it('should return false for decimal age', () => {
    expect(isValidAge(25.5)).toBe(false);
  });

  it('should return false for string age', () => {
    expect(isValidAge('25')).toBe(false);
  });

  it('should return false for null', () => {
    expect(isValidAge(null)).toBe(false);
  });
});