import { isEmpty, formatCPF, unformatCPF, isValidCPF } from "./validation";

describe("Validation Utils", () => {
  describe("isEmpty", () => {
    it("should return true for empty string", () => {
      expect(isEmpty("")).toBe(true);
    });

    it("should return true for string with only spaces", () => {
      expect(isEmpty("   ")).toBe(true);
    });

    it("should return false for non-empty string", () => {
      expect(isEmpty("test")).toBe(false);
    });

    it("should return false for string with content and spaces", () => {
      expect(isEmpty("  test  ")).toBe(false);
    });

    it("should return true for undefined", () => {
      expect(isEmpty(undefined as any)).toBe(true);
    });

    it("should return true for null", () => {
      expect(isEmpty(null as any)).toBe(true);
    });

    it("should return false for zero", () => {
      expect(isEmpty("0")).toBe(false);
    });

    it("should return false for string with special characters", () => {
      expect(isEmpty("!@#$")).toBe(false);
    });
  });

  describe("formatCPF", () => {
    it("should format CPF with 11 digits correctly", () => {
      expect(formatCPF("12345678900")).toBe("123.456.789-00");
    });

    it("should handle partial CPF (3 digits)", () => {
      expect(formatCPF("123")).toBe("123");
    });

    it("should handle partial CPF (4 digits)", () => {
      expect(formatCPF("1234")).toBe("123.4");
    });

    it("should handle partial CPF (6 digits)", () => {
      expect(formatCPF("123456")).toBe("123.456");
    });

    it("should handle partial CPF (7 digits)", () => {
      expect(formatCPF("1234567")).toBe("123.456.7");
    });

    it("should handle partial CPF (9 digits)", () => {
      expect(formatCPF("123456789")).toBe("123.456.789");
    });

    it("should handle partial CPF (10 digits)", () => {
      expect(formatCPF("1234567890")).toBe("123.456.789-0");
    });

    it("should remove non-numeric characters before formatting", () => {
      expect(formatCPF("123.456.789-00")).toBe("123.456.789-00");
    });

    it("should handle empty string", () => {
      expect(formatCPF("")).toBe("");
    });

    it("should handle string with letters", () => {
      expect(formatCPF("123abc456def789")).toBe("123.456.789");
    });

    it("should limit to 11 digits", () => {
      expect(formatCPF("123456789001234")).toBe("123.456.789-00");
    });

    it("should handle special characters", () => {
      expect(formatCPF("123@456#789$00")).toBe("123.456.789-00");
    });

    it("should handle spaces", () => {
      expect(formatCPF("123 456 789 00")).toBe("123.456.789-00");
    });

    it("should handle single digit", () => {
      expect(formatCPF("1")).toBe("1");
    });

    it("should format real CPF correctly", () => {
      expect(formatCPF("13271936986")).toBe("132.719.369-86");
    });
  });

  describe("unformatCPF", () => {
    it("should remove formatting from CPF", () => {
      expect(unformatCPF("123.456.789-00")).toBe("12345678900");
    });

    it("should handle CPF without formatting", () => {
      expect(unformatCPF("12345678900")).toBe("12345678900");
    });

    it("should remove all non-numeric characters", () => {
      expect(unformatCPF("123-456-789.00")).toBe("12345678900");
    });

    it("should handle empty string", () => {
      expect(unformatCPF("")).toBe("");
    });

    it("should remove spaces", () => {
      expect(unformatCPF("123 456 789 00")).toBe("12345678900");
    });

    it("should remove letters", () => {
      expect(unformatCPF("123ABC456DEF789")).toBe("123456789");
    });

    it("should remove special characters", () => {
      expect(unformatCPF("123@456#789$00")).toBe("12345678900");
    });

    it("should handle partial CPF", () => {
      expect(unformatCPF("123.456")).toBe("123456");
    });

    it("should handle CPF with parentheses", () => {
      expect(unformatCPF("(123)456-789-00")).toBe("12345678900");
    });
  });

  describe("isValidCPF", () => {
    // Valid CPFs
    it("should validate correct CPF", () => {
      expect(isValidCPF("13271936986")).toBe(true);
    });

    it("should validate correct formatted CPF", () => {
      expect(isValidCPF("132.719.369-86")).toBe(true);
    });

    it("should validate another correct CPF", () => {
      expect(isValidCPF("11144477735")).toBe(true);
    });

    it("should validate formatted correct CPF", () => {
      expect(isValidCPF("111.444.777-35")).toBe(true);
    });

    // Invalid CPFs - wrong length
    it("should reject CPF with less than 11 digits", () => {
      expect(isValidCPF("123456789")).toBe(false);
    });

    it("should reject CPF with more than 11 digits", () => {
      expect(isValidCPF("123456789012")).toBe(false);
    });

    it("should reject empty CPF", () => {
      expect(isValidCPF("")).toBe(false);
    });

    // Invalid CPFs - all same digits
    it("should reject CPF with all zeros", () => {
      expect(isValidCPF("00000000000")).toBe(false);
    });

    it("should reject CPF with all ones", () => {
      expect(isValidCPF("11111111111")).toBe(false);
    });

    it("should reject CPF with all twos", () => {
      expect(isValidCPF("22222222222")).toBe(false);
    });

    it("should reject CPF with all threes", () => {
      expect(isValidCPF("33333333333")).toBe(false);
    });

    it("should reject CPF with all fours", () => {
      expect(isValidCPF("44444444444")).toBe(false);
    });

    it("should reject CPF with all fives", () => {
      expect(isValidCPF("55555555555")).toBe(false);
    });

    it("should reject CPF with all sixes", () => {
      expect(isValidCPF("66666666666")).toBe(false);
    });

    it("should reject CPF with all sevens", () => {
      expect(isValidCPF("77777777777")).toBe(false);
    });

    it("should reject CPF with all eights", () => {
      expect(isValidCPF("88888888888")).toBe(false);
    });

    it("should reject CPF with all nines", () => {
      expect(isValidCPF("99999999999")).toBe(false);
    });

    // Invalid CPFs - wrong check digits
    it("should reject CPF with invalid first check digit", () => {
      expect(isValidCPF("13271936985")).toBe(false);
    });

    it("should reject CPF with invalid second check digit", () => {
      expect(isValidCPF("13271936987")).toBe(false);
    });

    it("should reject CPF with both check digits wrong", () => {
      expect(isValidCPF("13271936900")).toBe(false);
    });

    // Edge cases
    it("should handle CPF with leading zeros", () => {
      expect(isValidCPF("00000000191")).toBe(true);
    });

    it("should reject CPF with letters", () => {
      expect(isValidCPF("123ABC78900")).toBe(false);
    });

    it("should reject CPF with special characters only", () => {
      expect(isValidCPF("###########")).toBe(false);
    });

    it("should handle formatted invalid CPF", () => {
      expect(isValidCPF("123.456.789-00")).toBe(false);
    });

    it("should handle partially formatted CPF", () => {
      // Should accept partially formatted CPF and validate correctly
      expect(isValidCPF("132719369-86")).toBe(true);
    });

    it("should validate CPF with spaces", () => {
      expect(isValidCPF("132 719 369 86")).toBe(true);
    });

    // More valid CPFs to ensure algorithm is correct
    it("should validate different valid CPFs", () => {
      // Multiple valid CPFs to ensure algorithm correctness
      expect(isValidCPF("52998224725")).toBe(true);
      expect(isValidCPF("111.444.777-35")).toBe(true);
    });

    it("should validate CPF with formatted characters", () => {
      expect(isValidCPF("529.982.247-25")).toBe(true);
    });
  });

  describe("Integration Tests", () => {
    it("should format and unformat CPF correctly", () => {
      const original = "12345678900";
      const formatted = formatCPF(original);
      const unformatted = unformatCPF(formatted);

      expect(unformatted).toBe(original);
    });

    it("should validate formatted CPF after formatting", () => {
      const cpf = "13271936986";
      const formatted = formatCPF(cpf);

      expect(isValidCPF(formatted)).toBe(true);
    });

    it("should handle complete validation flow", () => {
      const input = "132.719.369-86";

      expect(isEmpty(input)).toBe(false);

      const unformatted = unformatCPF(input);
      expect(unformatted).toBe("13271936986");

      expect(isValidCPF(unformatted)).toBe(true);

      const reformatted = formatCPF(unformatted);
      expect(reformatted).toBe("132.719.369-86");
    });

    it("should detect invalid CPF in complete flow", () => {
      const input = "123.456.789-00";

      expect(isEmpty(input)).toBe(false);

      const unformatted = unformatCPF(input);
      expect(unformatted).toBe("12345678900");

      expect(isValidCPF(unformatted)).toBe(false);
    });

    it("should handle empty input in complete flow", () => {
      const input = "";

      expect(isEmpty(input)).toBe(true);
      expect(formatCPF(input)).toBe("");
      expect(unformatCPF(input)).toBe("");
      expect(isValidCPF(input)).toBe(false);
    });
  });
});
