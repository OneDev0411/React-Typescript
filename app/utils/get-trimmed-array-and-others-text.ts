import pluralize from 'pluralize'

interface Options {
  threshold: number
  totalCount: number
}

export function getTrimmedArrayAndOthersText<T>(
  items: T[],
  { threshold = 2, totalCount = items.length }: Options = {} as Options
) {
  const otherCount = totalCount - threshold

  return {
    visibleItems: items.slice(0, threshold),
    othersText:
      totalCount > threshold ? pluralize('other', otherCount, true) : null,
    otherItems: items.slice(threshold + 1)
  }
}
