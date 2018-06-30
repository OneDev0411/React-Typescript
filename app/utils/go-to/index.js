import { browserHistory } from 'react-router'

/**
 * Going to a route with memorizing current page URL and title as a state
 * @param {string} url Next page url.
 * @param {string || null} pageTitle Current page title.
 */

export function goTo(url, pageTitle) {
  browserHistory.push({
    pathname: url,
    state: pageTitle ? {
      previousPage: {
        url: window && window.location.pathname,
        title: pageTitle
      }
    } : undefined
  })
}