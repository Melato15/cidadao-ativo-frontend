/**
 * Formats a CPF string with the mask 000.000.000-00
 * @param cpf - The CPF string (only numbers)
 * @returns The formatted CPF string
 */
export const formatCPF = (cpf: string): string => {
  // Remove all non-numeric characters
  const numbers = cpf.replace(/\D/g, "");

  // Apply the CPF mask
  if (numbers.length <= 3) {
    return numbers;
  } else if (numbers.length <= 6) {
    return `${numbers.slice(0, 3)}.${numbers.slice(3)}`;
  } else if (numbers.length <= 9) {
    return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`;
  } else {
    return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(
      6,
      9
    )}-${numbers.slice(9, 11)}`;
  }
};

/**
 * Removes the CPF mask and returns only numbers
 * @param cpf - The formatted CPF string
 * @returns The CPF string with only numbers
 */
export const unformatCPF = (cpf: string): string => {
  return cpf.replace(/\D/g, "");
};

/**
 * Basic CPF validation (checks if it has 11 digits and is not a sequence of equal numbers)
 * @param cpf - The CPF string (can be formatted or not)
 * @returns true if the CPF is valid, false otherwise
 */
export const isValidCPF = (cpf: string): boolean => {
  const numbers = unformatCPF(cpf);

  // Check if it has 11 digits
  if (numbers.length !== 11) {
    return false;
  }

  // Check if all digits are the same
  if (/^(\d)\1{10}$/.test(numbers)) {
    return false;
  }

  // CPF validation algorithm
  let sum = 0;
  let remainder;

  // Validate first digit
  for (let i = 1; i <= 9; i++) {
    sum += parseInt(numbers.substring(i - 1, i)) * (11 - i);
  }
  remainder = (sum * 10) % 11;

  if (remainder === 10 || remainder === 11) {
    remainder = 0;
  }

  if (remainder !== parseInt(numbers.substring(9, 10))) {
    return false;
  }

  sum = 0;

  // Validate second digit
  for (let i = 1; i <= 10; i++) {
    sum += parseInt(numbers.substring(i - 1, i)) * (12 - i);
  }
  remainder = (sum * 10) % 11;

  if (remainder === 10 || remainder === 11) {
    remainder = 0;
  }

  if (remainder !== parseInt(numbers.substring(10, 11))) {
    return false;
  }

  return true;
};

/**
 * Validates if a field is empty or only whitespace
 * @param value - The field value
 * @returns true if the field is empty, false otherwise
 */
export const isEmpty = (value: string): boolean => {
  return !value || value.trim().length === 0;
};

/**
 * Validates if two passwords match
 * @param password - The password
 * @param confirmPassword - The confirmation password
 * @returns true if passwords match, false otherwise
 */
export const passwordsMatch = (
  password: string,
  confirmPassword: string
): boolean => {
  return password === confirmPassword;
};

/**
 * Validates password strength (minimum 6 characters)
 * @param password - The password to validate
 * @returns true if password is valid, false otherwise
 */
export const isValidPassword = (password: string): boolean => {
  return password.length >= 6;
};

/**
 * Validates if a date is valid and the person is at least 16 years old
 * @param dateString - The date string in YYYY-MM-DD format
 * @returns true if the date is valid and age >= 16, false otherwise
 */
export const isValidBirthDate = (dateString: string): boolean => {
  if (!dateString) return false;

  const birthDate = new Date(dateString);
  const today = new Date();

  // Check if date is valid
  if (isNaN(birthDate.getTime())) return false;

  // Check if date is not in the future
  if (birthDate > today) return false;

  // Calculate age
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  // Check if person is at least 18 years old
  return age >= 18;
};

/**
 * Validates a full name (at least 2 words)
 * @param name - The full name to validate
 * @returns true if name is valid, false otherwise
 */
export const isValidFullName = (name: string): boolean => {
  if (isEmpty(name)) return false;

  const words = name.trim().split(/\s+/);
  return words.length >= 2 && words.every((word) => word.length >= 2);
};
