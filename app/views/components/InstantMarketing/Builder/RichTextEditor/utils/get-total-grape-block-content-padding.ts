export function getTotalGrapeBlockContentPadding(el: HTMLElement): string {
  let paddingLeft = 0
  let paddingRight = 0
  let paddingTop = 0
  let paddingBottom = 0

  let currentEl: HTMLElement | null = el

  do {
    const styles = getComputedStyle(currentEl)

    paddingLeft += parseFloat(styles.paddingLeft || '0')
    paddingRight += parseFloat(styles.paddingRight || '0')
    paddingTop += parseFloat(styles.paddingTop || '0')
    paddingBottom += parseFloat(styles.paddingBottom || '0')
    currentEl = currentEl.parentElement
  } while (currentEl && !currentEl.matches('[data-gjs-type]'))

  return `${paddingTop}px ${paddingRight}px ${paddingBottom}px ${paddingLeft}px`
}
