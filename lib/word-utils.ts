/**
 * Strips part-of-speech labels and explanatory text from word keys
 * Removes everything within parentheses, including the parentheses themselves
 * Handles multiple parenthesis groups and extra whitespace
 * Examples:
 *   "cause (n)" → "cause"
 *   "blur (v)" → "blur"
 *   "m RNA (messenger RNA)" → "m RNA"
 *   "stomach ulcer (gastric ulcer)" → "stomach ulcer"
 *   "dairy(adj)" → "dairy"
 *   "breeding (သားဖောက်ရန်အတွက်)" → "breeding"
 *   "contamination (အဆိပ်အတောက်၊ ရောဂါပိုးများ စသည်ဖြင့်)" → "contamination"
 */
export function stripPOS(word: string): string {
  if (!word) return word;
  
  // Remove all parenthetical content (with or without leading spaces)
  // Pattern explanation:
  // \s* = zero or more whitespace characters before the opening paren
  // \( = literal opening parenthesis
  // [^)]* = any character except closing paren (content inside parens)
  // \) = literal closing parenthesis
  // g = global flag to replace ALL occurrences (handles multiple paren groups)
  let normalized = word.replace(/\s*\([^)]*\)/g, '');
  
  // Normalize whitespace: collapse multiple spaces to single space
  normalized = normalized.replace(/\s+/g, ' ');
  
  // Remove leading and trailing whitespace
  normalized = normalized.trim();
  
  return normalized;
}

/**
 * Normalizes a word for comparison by:
 * 1. Stripping POS labels and explanatory text in parentheses
 * 2. Collapsing whitespace
 * 3. Converting to lowercase
 * 4. Trimming leading/trailing whitespace
 */
export function normalizeWord(word: string): string {
  return stripPOS(word).toLowerCase();
}
