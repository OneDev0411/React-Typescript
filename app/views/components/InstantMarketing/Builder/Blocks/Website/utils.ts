export const isComponent = (type: string) => (el: HTMLElement) =>
  el.dataset?.type === type

export const baseView = (blockClassNames: string, tagName: string = 'div') => ({
  tagName,
  init({ model }) {
    if (blockClassNames) {
      model.addClass(blockClassNames)
    }
  }
})
