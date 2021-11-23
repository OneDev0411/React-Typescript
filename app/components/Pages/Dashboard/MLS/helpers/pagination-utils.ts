export function getListingsPage<T>(
  listings: T[],
  currentPage: number,
  pageSize: number
): T[] {
  const start = (currentPage - 1) * pageSize
  const end = start + pageSize

  return listings.slice(start, end)
}
