export function wrapTableTag(html: string, className = 'wrap-table') {
  const tableTagReg = /(<table[^>]*>(?:.|\n)*?<\/table>)/i

  return html.replace(tableTagReg, `<div class="${className}">$1</div>`)
}
