
export function getOuterWidth(el: HTMLElement): number {
  let width = el.offsetWidth
  const style = getComputedStyle(el);

  width += parseInt(`${style.marginLeft || 0}`) + parseInt(`${style.marginRight || 0}`);
  return width;
}
