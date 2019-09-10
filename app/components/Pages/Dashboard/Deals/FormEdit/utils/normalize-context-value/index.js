export function normalizeContextValue(context, value) {
  if (!context || !value) {
    return value
  }

  if (context.data_type === 'Number') {
    return parseFloat(value.toString().replace(/,/g, ''))
  }

  if (context.data_type === 'Date') {
    return new Date(value).toDateString()
  }

  return value
}
