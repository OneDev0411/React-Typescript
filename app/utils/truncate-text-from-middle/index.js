export function truncateTextFromMiddle(string, len = 30) {
  if (!string || string.length <= len) {
    return string
  }

  const separator = '...'

  const charsToShow = len - 3
  const start = Math.ceil(charsToShow / 2)
  const end = Math.floor(charsToShow / 2)

  return (
    string.substr(0, start) + separator + string.substr(string.length - end)
  )
}