/* eslint-disable no-cond-assign, no-continue */

const maxSize = 15

const breakText = (text, rects, fontSize) => {
  if (!text) {
    text = ''
  }

  const el = document.createElement('div')

  el.style = {
    ...el.style,
    position: 'absolute',
    whiteSpace: 'nowrap',
    top: '-200px'
  }

  document.body.appendChild(el)

  const values = {}

  const words = text.trim().split(/\s{1,}/g)

  let i = -1
  let line

  if (!fontSize) {
    fontSize = rects[0].height
  }

  if (fontSize > maxSize) {
    // Max size. based on issue web#431
    fontSize = maxSize
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
        return breakText(text, rects, fontSize - 1)
      }
    }

    values[i] = line.trim()
    words.shift()
  }

  document.body.removeChild(el)

  return { values, fontSize }
}

export default breakText
