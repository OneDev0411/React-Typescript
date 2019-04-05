import { browserHistory } from 'react-router'

/**
 * Going to a route with memorizing current page URL and title as a state
 * @param {string} url Next page url.
 * @param {string || null} pageTitle Current page title.
 * @param {object} query Query params as an object
 * @param {object} state Additional state params as an object
 */

export function goTo(url, pageTitle = null, query = {}, state = {}) {
  const previousPage = pageTitle ? {
    previousPage: {
      url: window && window.location.pathname,
      title: pageTitle
    }
  } : {}

  const search = Object.keys(query).reduce((acc, curr, index) => {
    const mark = index === 0 ? '?' : '&'
    return `${acc}${mark}${curr}=${query[curr]}`
  }, '')

  console.log('GO TO', {
    pathname: url,
    search,
    state: {
      ...state,
      previousPage
    }
  })

  browserHistory.push({
    pathname: url,
    search,
    state: {
      ...state,
      previousPage
    }
  })
}