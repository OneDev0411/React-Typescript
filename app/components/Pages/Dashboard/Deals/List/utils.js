/**
 * @param {string} filterName
 * @returns {string} path for filter name
 */
export function getPathForFilter(filterName) {
  return `/dashboard/deals${
    filterName === 'All' ? '' : `/filter/${filterName}`
  }`
}
