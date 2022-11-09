import { browserHistory } from 'react-router'

/**
 * Going to a route with memorizing current page URL and title as a state
 * @param {string} url Next page url.
 * @param {string || null} pageTitle Current page title.
 * @param {object} query Query params as an object
 * @param {object} state Additional state params as an object
 * @param {boolean} replace Replace route
 */

export function goTo(
  url,
  pageTitle = null,
  query = {},
  state = {},
  replace = false
) {
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

  const path = {
    pathname,
    search,
    state: {
      ...state,
      previousPage
    }
  }

  if (replace) {
    browserHistory.replace(path)

    return
  }

  browserHistory.push(path)
}
