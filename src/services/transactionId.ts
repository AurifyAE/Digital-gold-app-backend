import { v4 as uuidv4 } from "uuid";

export function generateTransactionId(): string {
  // Take UUID, keep only digits, and slice the first 6
  const randomDigits = uuidv4().replace(/\D/g, "").slice(0, 6);

  // Ensure we always return exactly 8 chars (TR + 6 numbers)
  return "TR" + randomDigits.padEnd(6, "0");
}
