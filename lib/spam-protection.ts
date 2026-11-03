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
 * Detect keyboard-mash in a free-text message. isGibberish is tuned for names
 * and rejects normal sentences (all-caps words, "strengths"), so a message is
 * only checked when it is a single run of letters longer than 15 with no spaces.
 * An all-upper or all-lower run is checked without the case heuristics.
 */
export function isGibberishMessage(text: string): boolean {
  const trimmed = text.trim();
  if (!/^[a-zA-Z]{16,}$/.test(trimmed)) return false;
  const singleCase = trimmed === trimmed.toUpperCase() || trimmed === trimmed.toLowerCase();
  return isGibberish(singleCase ? trimmed.toLowerCase() : trimmed);
}

/**
 * Detect keyboard-mash in one word of a name. Only words of 12+ letters are
 * checked, and case is ignored. A consonant pair is "unusual" unless the first
 * letter is h/l/m/n/r/s, the second is h/l/r/w, or the letters are doubled
 * (so "sch", "str", "nd", "rz", "chw" all pass). Three or more unusual pairs
 * means mash ("cgzt", "qtgx"); long real surnames have 0-2.
 */
function isMashWord(word: string): boolean {
  const letters = word.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();
  if (letters.length < 12) return false;
  const consonant = /[bcdfghjklmnpqrstvwxz]/;
  let unusual = 0;
  for (let i = 1; i < letters.length; i++) {
    const a = letters[i - 1];
    const b = letters[i];
    if (!consonant.test(a) || !consonant.test(b)) continue;
    if (a === b || "hlmnrs".includes(a) || "hlrw".includes(b)) continue;
    unusual++;
  }
  return unusual >= 3;
}

/**
 * Validate a name field. Blocks only obvious junk: a real visitor with an
 * unusual name must get through.
 * - 1-50 chars after trimming, with at least one letter
 * - Only letters (any script, accents included), spaces, hyphens,
 *   apostrophes (' and ’) and periods
 * - No domain-like text ("spam.com"): a letter, a period, then 2+ letters
 * - No word of 12+ letters that looks like keyboard-mash
 */
export function isValidName(name: string): boolean {
  const trimmed = name.trim();
  if (trimmed.length < 1 || trimmed.length > 50) return false;
  if (!/\p{L}/u.test(trimmed)) return false;
  if (!/^[\p{L}\p{M} '’.-]+$/u.test(trimmed)) return false;
  if (/\p{L}\.\p{L}{2,}/u.test(trimmed)) return false;
  return !trimmed.split(/[ '’.-]+/).some(isMashWord);
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
  if (input.message && isGibberishMessage(input.message)) {
    return { passed: false, reason: "Please enter a valid message" };
  }

  // 5. Timing check (silent reject)
  if (input.formLoadedAt && !checkTiming(input.formLoadedAt)) {
    return { passed: false, reason: "spam_detected", isSilentReject: true };
  }

  return { passed: true };
}
