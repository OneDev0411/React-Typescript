export function getDefaultOptions(options) {
  return options.map(value => ({
    title: value,
    value
  }))
}
