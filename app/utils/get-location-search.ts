/**
 * A proxy hook to react-router-dom@6 useNavigate
 * @example <caption>Without url</caption>
 * getLocationSearch({query: 'something', id: 1})
 * // Returns: '?query=something&id=1
 * @example <caption>With url</caption>
 * getLocationSearch({query: 'something', id: 1},'/path?agent=12')
 * // Returns: '?agent=12&query=something&id=1
 * @returns {String} Returns location search string
 */
export const getLocationSearch = (query: object, url: string = ''): String => {
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
