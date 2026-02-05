/**
 * Spam protection utilities for intake forms.
 * Provides multi-layer validation to prevent bot submissions from creating
 * persons in Planning Center.
 */

/**
 * Check if honeypot field is empty (bots typically fill hidden fields).
 * Returns true if the field is empty (not a bot), false if filled (likely bot).
 */
export function checkHoneypot(honeypotValue: string | undefined): boolean {
  return !honeypotValue || honeypotValue.trim() === "";
}

/**
 * Detect gibberish/random text using heuristics:
 * - Vowel ratio (real words have vowels)
 * - Consecutive consonant sequences
 * - Case alternation patterns (random strings often have random case)
 * - Unusual uppercase patterns (uppercase in middle of words)
 */
export function isGibberish(text: string): boolean {
  const cleaned = text.toLowerCase().replace(/[^a-z]/g, "");
  if (cleaned.length < 2) return false;

  // Check vowel ratio - real names/words have vowels
  const vowels = cleaned.replace(/[^aeiou]/g, "").length;
  const vowelRatio = vowels / cleaned.length;
  if (vowelRatio < 0.15) return true; // Too few vowels

  // Check for long consonant sequences (>4 consecutive)
  if (/[bcdfghjklmnpqrstvwxyz]{5,}/.test(cleaned)) return true;

  const original = text.replace(/[^a-zA-Z]/g, "");
  if (original.length > 5) {
    // Check for alternating case patterns (random strings often have random case)
    // Names like "CGoCymNyQTGXOIuMtEy" have many case changes
    const caseChanges = original.split("").filter(
      (c, i, arr) =>
        i > 0 &&
        c === c.toUpperCase() !== (arr[i - 1] === arr[i - 1].toUpperCase())
    ).length;
    if (caseChanges / original.length > 0.4) return true;

    // Check for unusual uppercase sequences in the middle of words
    // Real names rarely have multiple uppercase letters in a row after the first letter
    // Pattern like "LgawoWOCGZTIanjR" has "WOCGZTI" sequence
    const middlePart = original.slice(1); // Skip first letter
    const uppercaseSequences = middlePart.match(/[A-Z]{3,}/g);
    if (uppercaseSequences && uppercaseSequences.some((seq) => seq.length >= 3)) {
      return true;
    }

    // Check for mixed case that doesn't follow name patterns
    // Real names typically: FirstLast, First-Last, O'Brien, etc.
    // Not: LgawoWOCGZTIanjR (random caps throughout)
    const upperCount = (original.match(/[A-Z]/g) || []).length;
    const lowerCount = (original.match(/[a-z]/g) || []).length;
    // If there are many uppercase letters scattered throughout (not just first letter)
    if (upperCount > 2 && lowerCount > 2 && upperCount / original.length > 0.3) {
      return true;
    }
  }

  return false;
}

/**
 * Validate a name field:
 * - Reasonable length (2-50 chars)
 * - Contains at least some letters
 * - Not gibberish
 */
export function isValidName(name: string): boolean {
  const trimmed = name.trim();
  // Reasonable length (2-50 chars)
  if (trimmed.length < 2 || trimmed.length > 50) return false;
  // Contains at least some letters
  if (!/[a-zA-Z]/.test(trimmed)) return false;
  // Not gibberish
  return !isGibberish(trimmed);
}

/**
 * Validate US phone number format.
 * Accepts: (555) 123-4567, 555-123-4567, 5551234567, +1 555-123-4567
 * Rejects: non-US numbers, invalid area codes, gibberish
 */
export function isValidUSPhoneNumber(phone: string): boolean {
  if (!phone) return true; // Optional field

  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, "");

  // US numbers: 10 digits, or 11 digits starting with 1
  let normalized = digits;
  if (digits.length === 11 && digits.startsWith("1")) {
    normalized = digits.slice(1); // Remove country code
  }

  if (normalized.length !== 10) return false;

  // Area code (first 3 digits) can't start with 0 or 1 per NANP rules
  const areaCode = normalized.slice(0, 3);
  if (areaCode[0] === "0" || areaCode[0] === "1") return false;

  return true;
}

/**
 * Check timing - forms submitted too quickly are likely bots.
 * Returns true if enough time has passed, false if too fast.
 */
export function checkTiming(formLoadedAt: number): boolean {
  const elapsed = Date.now() - formLoadedAt;
  return elapsed > 3000; // Minimum 3 seconds to fill form
}

export type SpamCheckResult =
  | { passed: true }
  | { passed: false; reason: string; isSilentReject?: boolean };

export type SpamCheckInput = {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  message?: string;
  honeypot?: string;
  formLoadedAt?: number;
};

/**
 * Main validation function that runs all spam checks.
 * Returns { passed: true } if valid, or { passed: false, reason, isSilentReject? } if invalid.
 *
 * Silent rejects (honeypot/timing) should return success to the user to not alert bots,
 * but skip PCO creation. User-facing errors show the reason.
 */
export function validateSubmission(input: SpamCheckInput): SpamCheckResult {
  // 1. Honeypot check (silent reject)
  if (!checkHoneypot(input.honeypot)) {
    return { passed: false, reason: "spam_detected", isSilentReject: true };
  }

  // 2. Name validation
  if (!isValidName(input.firstName)) {
    return { passed: false, reason: "Please enter a valid first name" };
  }
  if (!isValidName(input.lastName)) {
    return { passed: false, reason: "Please enter a valid last name" };
  }

  // 3. US phone validation (if provided)
  if (input.phone && !isValidUSPhoneNumber(input.phone)) {
    return { passed: false, reason: "Please enter a valid US phone number" };
  }

  // 4. Message validation (if provided)
  if (input.message && isGibberish(input.message)) {
    return { passed: false, reason: "Please enter a valid message" };
  }

  // 5. Timing check (silent reject)
  if (input.formLoadedAt && !checkTiming(input.formLoadedAt)) {
    return { passed: false, reason: "spam_detected", isSilentReject: true };
  }

  return { passed: true };
}
