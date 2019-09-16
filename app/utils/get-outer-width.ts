
export function getOuterWidth(el: HTMLElement): number {
  const style = getComputedStyle(el)

  return el.offsetWidth + parseInt(`${style.marginLeft || 0}`) + parseInt(`${style.marginRight || 0}`)
}
