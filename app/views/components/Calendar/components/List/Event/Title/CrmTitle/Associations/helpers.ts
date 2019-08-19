export function isLastItem(arr: any[], currenttIndex: number) {
  if (arr.length <= 1) {
    return true
  }

  if (arr.length === currenttIndex + 1) {
    return true
  }

  return false
}
