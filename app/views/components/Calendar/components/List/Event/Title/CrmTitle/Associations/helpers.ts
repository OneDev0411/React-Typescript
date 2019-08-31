export function isLastItem(arr: any[], currentIndex: number) {
  if (arr.length <= 1) {
    return true
  }

  if (arr.length === currentIndex + 1) {
    return true
  }

  return false
}
