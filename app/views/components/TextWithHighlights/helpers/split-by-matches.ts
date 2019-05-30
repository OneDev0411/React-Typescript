export function splitByMatches(regExp: RegExp, text: string) {
  let matchResult
  let parts: { text: string; match: boolean }[] = []
  let lastIndex = 0

  // eslint-disable-next-line no-cond-assign
  while ((matchResult = regExp.exec(text))) {
    const length = matchResult[0].length

    addPart(text.slice(lastIndex, matchResult.index), false)
    addPart(text.substr(matchResult.index, length), true)
    lastIndex = matchResult.index + length
  }

  addPart(text.slice(lastIndex), false)

  function addPart(text: string, match: boolean) {
    if (text) {
      parts.push({ text, match })
    }
  }

  return parts
}
