export const isComponent = (type: string) => (el: HTMLElement) =>
  el.dataset?.type === type

export const baseView = (blockClassNames: string | undefined) => ({
  init({ model }) {
    if (blockClassNames) {
      model.addClass(blockClassNames)
    }
  }
})
