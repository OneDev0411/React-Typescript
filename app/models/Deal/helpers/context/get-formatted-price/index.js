/**
 * a helper that formats price
 */
export function getFormattedPrice(
  number,
  style = 'currency',
  minimumFractionDigits = 2
) {
  if (typeof number !== 'number') {
    return number
  }

  return new Intl.NumberFormat('en-US', {
    style,
    currency: 'USD',
    minimumFractionDigits
  }).format(number)
}
