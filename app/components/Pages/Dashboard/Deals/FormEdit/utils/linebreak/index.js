/* eslint-disable no-cond-assign, no-continue */

const maxSize = 15
const el = document.createElement('div')

document.body.appendChild(el)

const breakText = (text, rects, fontSize, fontName, isBold) => {
  if (!text) {
    text = ''
  }

  el.innerText = ''
  el.style.position = 'absolute'
  el.style.whiteSpace = 'nowrap'
  el.style.top = '-200px'
  el.style.fontFamily = fontName

  if (isBold) {
    el.style.fontWeight = 'bold'
  }

  const values = {}

  const words = text
    .toString()
    .trim()
    .split(/\s{1,}/g)

  let i = -1
  let line

  if (!fontSize) {
    fontSize = rects[0].height
  }

  if (fontSize > maxSize) {
    // Max size. based on issue web#431
    fontSize = maxSize
  }

  if (fontSize <= 1) {
    return {
      values: {
        0: text
      },
      fontSize: 1
    }
  }

  if (rects[0].multiline) {
    return {
      values: [text],
      fontSize
    }
  }

  const linebreak = () => {
    if (!rects[i + 1]) {
      return false
    }

    i++
    line = ''

    el.style.height = `${fontSize}px`
    el.style.fontSize = `${fontSize}px`

    return true
  }

  linebreak()

  let word

  while ((word = words[0])) {
    line += `${word} `

    const pre = el.innerText

    el.innerText = line

    if (el.clientWidth >= rects[i].width) {
      if (linebreak()) {
        values[i - 1] = pre
        continue
      } else {
        /* Text did not fit the boundaries but line break is not possible
           because there is no more new text areas.
           We have to shrink the font size and try again
           */
        return breakText(text, rects, fontSize - 1, fontName, isBold)
      }
    }

    values[i] = line.trim()
    words.shift()
  }

  return { values, fontSize }
}

export default breakText
