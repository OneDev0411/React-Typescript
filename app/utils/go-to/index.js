import { browserHistory } from 'react-router'

/**
 * Going to a route with memorizing current page URL and title as a state
 * @param {string} url Next page url.
 * @param {string || null} pageTitle Current page title.
 * @param {object} query Query params as an object
 * @param {object} state Additional state params as an object
 */

export function goTo(url, pageTitle = null, query = {}, state = {}) {
  const previousPage = pageTitle
    ? {
        previousPage: {
          url: window && window.location.pathname,
          title: pageTitle
        }
      }
    : {}

  const [pathname, embeddedSearch] = url.split('?')

  const search = Object.keys(query).reduce(
    (acc, curr) => {
      const mark = !acc ? '?' : '&'

      return `${acc}${mark}${curr}=${query[curr]}`
    },
    embeddedSearch ? `?${embeddedSearch}` : ''
  )

  browserHistory.push({
    pathname,
    search,
    state: {
      ...state,
      previousPage
    }
  })
}
