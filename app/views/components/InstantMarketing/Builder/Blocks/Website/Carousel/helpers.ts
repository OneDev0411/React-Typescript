export function applyStyle(
  el: HTMLElement,
  styles: Partial<CSSStyleDeclaration>
) {
  Object.keys(styles).forEach(key => {
    el.style[key] = styles[key]
  })
}

export const carouselBaseView = {
  onRender() {
    this.el.removeAttribute('class')
    this.el.removeAttribute('style')
  }
}
