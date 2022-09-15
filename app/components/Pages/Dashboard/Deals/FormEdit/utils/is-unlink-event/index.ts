export function isUnlinkEvent(e: MouseEvent) {
  return e.shiftKey || e.ctrlKey
}
