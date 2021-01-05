export const numberToUSD = (number: number, options: Intl.NumberFormatOptions = {}) => {
    return number.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        ...options
    })
}