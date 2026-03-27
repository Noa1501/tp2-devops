export function capitalize(str: string): string {
	if (!str) return '';
	return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }
  
  export function calculateAverage(numbers: number[]): number {
	if (!numbers || numbers.length === 0) return 0;
	const sum = numbers.reduce((acc, n) => acc + n, 0);
	return Math.round((sum / numbers.length) * 100) / 100;
  }
  
  export function slugify(text: string): string {
	if (!text) return '';
	return text
	  .trim()
	  .toLowerCase()
	  .replace(/[^a-z0-9\s-]/g, '')
	  .replace(/\s+/g, '-');
  }
  
  export function clamp(value: number, min: number, max: number): number {
	return Math.min(Math.max(value, min), max);
  }
  
  export function sortStudents(
	students: { name: string; grade: number; age: number }[],
	sortBy: 'name' | 'grade' | 'age' = 'grade',
	order: 'asc' | 'desc' = 'asc',
  ): { name: string; grade: number; age: number }[] {
	if (!students || students.length === 0) return [];
  
	const result = [...students];
  
	result.sort((a, b) => {
	  if (sortBy === 'name') {
		return order === 'asc'
		  ? a.name.localeCompare(b.name)
		  : b.name.localeCompare(a.name);
	  }
	  return order === 'asc'
		? a[sortBy] - b[sortBy]
		: b[sortBy] - a[sortBy];
	});
  
	return result;
  }