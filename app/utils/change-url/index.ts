/**
 * Change browser url without reloading page or redirecting
 * @param {string} url page url.
 * @param {object} query Query params as an object
 */

export function changeUrl(url: string, query: object = {}) {
  const [pathname, embeddedSearch] = url.split('?')

  const search = Object.keys(query).reduce(
    (acc, curr) => {
      const mark = !acc ? '?' : '&'

      return `${acc}${mark}${curr}=${query[curr]}`
    },
    embeddedSearch ? `?${embeddedSearch}` : ''
  )

  window.history.pushState({}, '', `${pathname}${search}`)
}
