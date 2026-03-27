import { capitalize, calculateAverage, slugify, clamp, sortStudents } from './utils';

describe('capitalize', () => {
  it('should return Hello when given hello', () => {
    expect(capitalize('hello')).toBe('Hello');
  });

  it('should return World when given WORLD', () => {
    expect(capitalize('WORLD')).toBe('World');
  });

  it('should return empty string when given empty string', () => {
    expect(capitalize('')).toBe('');
  });

  it('should return empty string when given null', () => {
    expect(capitalize(null)).toBe('');
  });
});

describe('calculateAverage', () => {
  it('should return 12 when given [10, 12, 14]', () => {
    expect(calculateAverage([10, 12, 14])).toBe(12);
  });

  it('should return 15 when given [15]', () => {
    expect(calculateAverage([15])).toBe(15);
  });

  it('should return 0 when given empty array', () => {
    expect(calculateAverage([])).toBe(0);
  });

  it('should return 0 when given null', () => {
    expect(calculateAverage(null)).toBe(0);
  });

  it('should return 11 when given [10, 11, 12]', () => {
    expect(calculateAverage([10, 11, 12])).toBe(11);
  });

  it('should round to 2 decimals', () => {
    expect(calculateAverage([10, 11, 13])).toBe(11.33);
  });
});

describe('slugify', () => {
  it('should return hello-world when given Hello World', () => {
    expect(slugify('Hello World')).toBe('hello-world');
  });

  it('should trim spaces and slugify', () => {
    expect(slugify('  Spaces Everywhere  ')).toBe('spaces-everywhere');
  });

  it('should remove special characters', () => {
    expect(slugify("C'est l'ete !")).toBe('cest-lete');
  });

  it('should return empty string when given empty string', () => {
    expect(slugify('')).toBe('');
  });
});

describe('clamp', () => {
  it('should return 5 when value is within range', () => {
    expect(clamp(5, 0, 10)).toBe(5);
  });

  it('should return min when value is below min', () => {
    expect(clamp(-5, 0, 10)).toBe(0);
  });

  it('should return max when value is above max', () => {
    expect(clamp(15, 0, 10)).toBe(10);
  });

  it('should return 0 when min max and value are all 0', () => {
    expect(clamp(0, 0, 0)).toBe(0);
  });
});

describe('sortStudents', () => {
  const students = [
    { name: 'Charlie', grade: 12, age: 22 },
    { name: 'Alice', grade: 18, age: 20 },
    { name: 'Bob', grade: 9, age: 25 },
  ];

  it('should sort students by grade ascending', () => {
    const result = sortStudents(students, 'grade', 'asc');
    expect(result[0].grade).toBe(9);
    expect(result[2].grade).toBe(18);
  });

  it('should sort students by grade descending', () => {
    const result = sortStudents(students, 'grade', 'desc');
    expect(result[0].grade).toBe(18);
    expect(result[2].grade).toBe(9);
  });

  it('should sort students by name ascending', () => {
    const result = sortStudents(students, 'name', 'asc');
    expect(result[0].name).toBe('Alice');
    expect(result[2].name).toBe('Charlie');
  });

  it('should sort students by age ascending', () => {
    const result = sortStudents(students, 'age', 'asc');
    expect(result[0].age).toBe(20);
    expect(result[2].age).toBe(25);
  });

  it('should return empty array when given null', () => {
    expect(sortStudents(null)).toEqual([]);
  });

  it('should return empty array when given empty array', () => {
    expect(sortStudents([])).toEqual([]);
  });

  it('should not modify the original array', () => {
    const original = [...students];
    sortStudents(students, 'grade', 'desc');
    expect(students).toEqual(original);
  });

  it('should default to ascending order', () => {
    const result = sortStudents(students, 'grade');
    expect(result[0].grade).toBe(9);
  });
});