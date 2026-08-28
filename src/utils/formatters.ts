/**
 * Utility functions for formatting values, prices, and currencies in the POS application.
 */

/**
 * Format a numeric amount as currency (defaulting to Indian Rupee ₹).
 * Handles floating-point numbers gracefully and formats with 2 decimal places.
 */
export function formatCurrency(amount: number | undefined | null, symbol: string = '₹'): string {
  const val = Number(amount) || 0;
  // Format with standard locale or two decimal places
  const formattedVal = val.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  return `${symbol}${formattedVal}`;
}

/**
 * Format specifically in INR with symbol ₹
 */
export function formatINR(amount: number | undefined | null): string {
  return formatCurrency(amount, '₹');
}
