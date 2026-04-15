/**
 * Formats a number as Indian Rupee currency string.
 * e.g. 1500 → "₹1,500"
 */
export const formatPrice = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
  }).format(amount)
}