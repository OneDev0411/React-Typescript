import positionSuggestions from 'draft-js-emoji-plugin/lib/utils/positionSuggestions'

/**
 * The default positionSuggestions function doesn't take overflow into account
 * and therefore if the suggestions menu is to be opened at the ends of
 * horizontal or vertical bounds of the editor, it goes off screen or causes
 * weird scrolls. this new positioning function takes this into account and
 * doesn't let the suggestions menu to go off the bounds of the editor
 * @param args
 */
export const getEmojiSuggestionsPosition = args => {
  const styles = positionSuggestions(args)

  const container = getRelativeParent(args.popover.parentElement)!

  const left = parseFloat(styles.left)
  const top = parseFloat(styles.top)

  const offset = 15

  const topOverflow =
    top +
    (args.popover as HTMLElement).offsetHeight -
    (container.offsetHeight - offset)

  const leftOverflow =
    left +
    (args.popover as HTMLElement).offsetWidth -
    (container.offsetWidth - offset)

  const correctedLeft = left - Math.max(0, leftOverflow)
  const correctedTop = top - Math.max(0, topOverflow)

  return { ...styles, left: `${correctedLeft}px`, top: `${correctedTop}px` }
}

/**
 * this function is actually copied from
 * draft-js-emoji-plugin/lib/utils/positionSuggestions because it's not exported
 */
function getRelativeParent(element: HTMLElement | null): HTMLElement | null {
  if (!element) {
    return null
  }

  const position = window.getComputedStyle(element).getPropertyValue('position')

  if (position !== 'static') {
    return element
  }

  return getRelativeParent(element.parentElement)
}
