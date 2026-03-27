export function isValidEmail(email: string): boolean {
	if (!email) return false;
	const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return regex.test(email);
  }
  
  export interface PasswordValidation {
	valid: boolean;
	errors: string[];
  }
  
  export function isValidPassword(password: string): PasswordValidation {
	if (!password) {
	  return {
		valid: false,
		errors: [
		  'Minimum 8 caractères requis',
		  'Au moins 1 majuscule requise',
		  'Au moins 1 minuscule requise',
		  'Au moins 1 chiffre requis',
		  'Au moins 1 caractère spécial requis (!@#$%^&*)',
		],
	  };
	}
  
	const errors: string[] = [];
  
	if (password.length < 8) {
	  errors.push('Minimum 8 caractères requis');
	}
	if (!/[A-Z]/.test(password)) {
	  errors.push('Au moins 1 majuscule requise');
	}
	if (!/[a-z]/.test(password)) {
	  errors.push('Au moins 1 minuscule requise');
	}
	if (!/[0-9]/.test(password)) {
	  errors.push('Au moins 1 chiffre requis');
	}
	if (!/[!@#$%^&*]/.test(password)) {
	  errors.push('Au moins 1 caractère spécial requis (!@#$%^&*)');
	}
  
	return {
	  valid: errors.length === 0,
	  errors,
	};
  }
  
  export function isValidAge(age: unknown): boolean {
	if (age === null || age === undefined) return false;
	if (typeof age !== 'number') return false;
	if (!Number.isInteger(age)) return false;
	return age >= 0 && age <= 150;
  }