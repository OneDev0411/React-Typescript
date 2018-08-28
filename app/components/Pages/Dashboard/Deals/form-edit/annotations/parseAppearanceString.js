const parseAppearanceString = (string = '') => {
  const a = string.split(/\s/)

  let font, size

  let red = 0, green = 0, blue = 0

  let bold = false

  const tfi = a.indexOf('Tf')

  if (tfi > -1) {
    /*
     * Helvetica-Bold
     * Arial,Bold
     * These are example font names.
     *
     * But the first part is actually the font name
     * '-Bold' and ',Bold' are just hints
     */
    const fullFont = a[tfi - 2]
    font = fullFont.match(/([a-zA-Z_]*)/ig)[1]

    bold = fullFont.search(/bold/ig) > -1

    size = parseFloat(a[tfi - 1])
  }

  const gi = a.indexOf('g')

  if (gi > -1) {
    red = green = blue = parseFloat(a[gi - 1]) * 255
  }

  const rgi = a.indexOf('rg')

  if (rgi > -1) {
    red   = parseFloat(a[rgi - 3]) * 255
    green = parseFloat(a[rgi - 2]) * 255
    blue  = parseFloat(a[rgi - 1]) * 255
  }


  /*
   * Safari cannot accept floats in css rgb().
   * That's why we round them.
   */
  const color = `rgb(${Math.round(red)}, ${Math.round(green)}, ${Math.round(blue)})`

  return {
    font, size, color, bold
  }
}

export default parseAppearanceString