export function createYearArray(start = new Date().getFullYear(), end = 1990) {
  return [
    null,
    ...Array.from({ length: (end - start) / -1 + 1 }, (_, i) => start + i * -1)
  ]
}

export function filterGroupChangesCount<T>(
  object: T,
  base: Partial<T>,
  groups: Partial<Record<keyof T, string>>
): number {
  let count = 0
  let activeGroups: Record<string, boolean> = {}

  Object.keys(object).forEach(key => {
    if (
      typeof base[key as keyof T] !== 'undefined' &&
      object[key as keyof T] !== base[key as keyof T] &&
      groups[key as keyof T] &&
      !activeGroups[groups[key]]
    ) {
      activeGroups[groups[key]] = true
      count++
    }
  })

  return count
}
