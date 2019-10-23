import { plural } from './plural'

interface Options {
  threshold: number
  totalCount: number
}

export function getTrimmedArrayAndOthersText<T>(
  items: T[],
  { threshold = 2, totalCount = items.length }: Options = {} as Options
) {
  const otherCount = totalCount - threshold
  const isPlural = otherCount > 1

  return {
    visibleItems: items.slice(0, threshold),
    othersText:
      totalCount > threshold ? plural(`${otherCount} other`, isPlural) : null,
    otherItems: items.slice(threshold + 1)
  }
}
