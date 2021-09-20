const parseAppearanceString = appearance => {
  /*
   * Safari cannot accept floats in css rgb().
   * That's why we round them.
   */
  const color = `rgb(${Math.round(appearance?.fontColor[0] || 0)}, ${Math.round(
    appearance?.fontColor[1] || 0
  )}, ${Math.round(appearance?.fontColor[2] || 0)})`

  return {
    color,
    font: appearance.fontName,
    size: appearance.fontSize,
    bold: appearance.fontName.toLowerCase().includes('bold')
  }
}

export default parseAppearanceString
