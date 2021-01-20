export const isComponent = (type: string) => (el: Element) =>
  el.tagName === type.toUpperCase()
