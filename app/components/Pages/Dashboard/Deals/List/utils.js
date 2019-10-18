/**
 * @param {string} filterName
 * @returns {string} path for filter name
 */
export function getFilterUrl(filterName, queryParams) {
  const queryString = new URLSearchParams(queryParams).toString()

  return `/dashboard/deals${
    filterName === 'All' ? '' : `/filter/${filterName}?${queryString}`
  }`
}
