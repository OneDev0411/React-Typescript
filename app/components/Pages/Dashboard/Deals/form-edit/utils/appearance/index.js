const parseAppearanceString = (string = '') => {
  const annotation = string.split(/\s/)

  let font
  let size
  let red = 0
  let green = 0
  let blue = 0

  let bold = false

  const tfi = annotation.indexOf('Tf')

  if (tfi > -1) {
    /*
     * Helvetica-Bold
     * Arial,Bold
     * These are example font names.
     *
     * But the first part is actually the font name
     * '-Bold' and ',Bold' are just hints
     */
    const fullFont = annotation[tfi - 2]

    font = fullFont.match(/([a-zA-Z_]*)/gi)[1]
    bold = fullFont.search(/bold/gi) > -1
    size = parseFloat(annotation[tfi - 1])
  }

  const gi = annotation.indexOf('g')

  if (gi > -1) {
    // eslint-disable-next-line
    red = green = blue = parseFloat(annotation[gi - 1]) * 255
  }

  const rgi = annotation.indexOf('rg')

  if (rgi > -1) {
    red = parseFloat(annotation[rgi - 3]) * 255
    green = parseFloat(annotation[rgi - 2]) * 255
    blue = parseFloat(annotation[rgi - 1]) * 255
  }

  /*
   * Safari cannot accept floats in css rgb().
   * That's why we round them.
   */
  const color = `rgb(${Math.round(red)}, ${Math.round(green)}, ${Math.round(
    blue
  )})`

  return {
    font,
    size,
    color,
    bold
  }
}

export default parseAppearanceString
