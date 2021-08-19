export function getResultsCountText(
  resultsCount: number,
  currentPage: number,
  pageSize: number
): string {
  const start = (currentPage - 1) * pageSize + 1
  const end = start + pageSize - 1

  if (resultsCount === 1) {
    return 'Showing 1 of 1 listing.'
  }

  return `Showing ${start} - ${Math.min(
    end,
    resultsCount
  )} of ${resultsCount} listings.`
}

export function getListingsPage<T>(
  listings: T[],
  currentPage: number,
  pageSize: number
): T[] {
  const start = (currentPage - 1) * pageSize
  const end = start + pageSize

  return listings.slice(start, end)
}
