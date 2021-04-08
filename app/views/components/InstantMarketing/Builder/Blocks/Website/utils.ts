export const isComponent = (
  type: string,
  returnFunc?: (el: HTMLElement) => object
) => (el: HTMLElement) =>
  el.dataset?.type === type
    ? returnFunc
      ? { type, ...returnFunc(el) }
      : true
    : false

export const baseView = (blockClassNames: string | undefined) => ({
  init({ model }) {
    if (blockClassNames) {
      model.addClass(blockClassNames)
    }
  }
})
