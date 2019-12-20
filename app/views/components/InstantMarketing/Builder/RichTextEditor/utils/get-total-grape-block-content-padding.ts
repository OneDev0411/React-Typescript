export function getTotalGrapeBlockContentPadding(
  el: HTMLElement,
  extraPadding = 0
): string {
  let paddingLeft = extraPadding
  let paddingRight = extraPadding
  let paddingTop = extraPadding
  let paddingBottom = extraPadding

  let currentEl: HTMLElement | null = el

  do {
    const styles = getComputedStyle(currentEl)

    paddingLeft +=
      parseFloat(styles.paddingLeft || '0') +
      parseFloat(styles.marginLeft || '0')
    paddingRight +=
      parseFloat(styles.paddingRight || '0') +
      parseFloat(styles.marginRight || '0')
    paddingTop +=
      parseFloat(styles.paddingTop || '0') + parseFloat(styles.marginTop || '0')
    paddingBottom +=
      parseFloat(styles.paddingBottom || '0') +
      parseFloat(styles.marginBottom || '0')
    currentEl = currentEl.parentElement
  } while (currentEl && !currentEl.matches('[data-gjs-type]'))

  return `${Math.max(0, paddingTop)}px ${Math.max(
    0,
    paddingRight
  )}px ${Math.max(0, paddingBottom)}px ${Math.max(0, paddingLeft)}px`
}
