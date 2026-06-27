import Razorpay from 'razorpay';

const keyId = process.env.RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_KEY_SECRET;

// Bypasses if default credentials are in place
export const isMockPayments = !keyId || !keySecret || keyId === 'rzp_test_yourkeyhere' || keySecret === 'yoursecret';

export const razorpay = !isMockPayments
  ? new Razorpay({
      key_id: keyId as string,
      key_secret: keySecret as string,
    })
  : null;

/**
 * Formats a number to Indian Rupee (INR) currency format
 */
export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
}

/**
 * Generates a unique membership card number starting with 'ABF'
 */
export function generateCardNumber(): string {
  // Generates e.g. ABF-9283-4912
  const segment1 = Math.floor(1000 + Math.random() * 9000);
  const segment2 = Math.floor(1000 + Math.random() * 9000);
  return `ABF-${segment1}-${segment2}`;
}
