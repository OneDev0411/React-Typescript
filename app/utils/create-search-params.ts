/**
 * Create search params string from a query object
 * @example <caption>Without url</caption>
 * createSearchParams({query: 'something', id: 1})
 * // Returns: '?query=something&id=1
 * @example <caption>With url</caption>
 * createSearchParams({query: 'something', id: 1},'/path?agent=12')
 * // Returns: '?agent=12&query=something&id=1
 * @returns {string} Returns location search string
 */
export const createSearchParams = (
  query: Record<string, string>,
  url: string = ''
): string => {
  const splittedUrl = url.split('?')
  const embeddedSearch = splittedUrl[1]

  const search = Object.keys(query).reduce(
    (acc, curr) => {
      const mark = !acc ? '?' : '&'

      return `${acc}${mark}${curr}=${query[curr]}`
    },
    embeddedSearch ? `?${embeddedSearch}` : ''
  )

  return search
}
