// Check if a value is empty
export const isEmpty = (value: string): boolean => {
  return !value || value.trim().length === 0;
};

// Format CPF with dots and dash (000.000.000-00)
export const formatCPF = (value: string): string => {
  // Remove all non-numeric characters
  const numbers = value.replace(/\D/g, "");

  // Apply CPF formatting
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

// Remove formatting from CPF (return only numbers)
export const unformatCPF = (value: string): string => {
  return value.replace(/\D/g, "");
};

// Validate CPF using the official algorithm
export const isValidCPF = (cpf: string): boolean => {
  // Remove formatting
  const cleanCPF = unformatCPF(cpf);

  // Check if has 11 digits
  if (cleanCPF.length !== 11) {
    return false;
  }

  // Check if all digits are the same
  if (/^(\d)\1{10}$/.test(cleanCPF)) {
    return false;
  }

  // Validate first check digit
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (10 - i);
  }
  let checkDigit1 = 11 - (sum % 11);
  if (checkDigit1 === 10 || checkDigit1 === 11) {
    checkDigit1 = 0;
  }

  if (checkDigit1 !== parseInt(cleanCPF.charAt(9))) {
    return false;
  }

  // Validate second check digit
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (11 - i);
  }
  let checkDigit2 = 11 - (sum % 11);
  if (checkDigit2 === 10 || checkDigit2 === 11) {
    checkDigit2 = 0;
  }

  return checkDigit2 === parseInt(cleanCPF.charAt(10));
};
