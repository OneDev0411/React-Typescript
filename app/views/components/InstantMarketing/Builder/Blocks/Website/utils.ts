export const isComponent = (type: string) => (el: Element) =>
  el.tagName === type.toUpperCase()

export const baseView = (blockClassNames: string, tagName: string = 'div') => ({
  tagName,
  init({ model }) {
    if (blockClassNames) {
      model.addClass(blockClassNames)
    }
  }
})
