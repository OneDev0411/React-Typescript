export function isMJImagePlaceholderComponent(element: HTMLElement): boolean {
  return (
    element.tagName === 'MJ-IMAGE' &&
    element.dataset?.component === 'placeholder'
  )
}
