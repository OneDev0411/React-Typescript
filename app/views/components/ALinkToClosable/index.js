import React from 'react'

import { browserHistory } from 'react-router'

import ALink from '../ALink'

ALinkToClosable.propTypes = ALink.propTypes
ALinkToClosable.defaultProps = ALink.defaultProps

function ALinkToClosable(props) {
  return <ALink {...props} to={props.to && withFromState(props.to)} />
}

export default ALinkToClosable

/**
 * extract pathname, search and hash from a url
 * @param {string} url
 * @returns {{pathname: string, search: string, hash: string}}
 */
function getUrlParts(url) {
  const [pathname, searchAndHash = ''] = url.split('?')
  const [search, hash = ''] = searchAndHash.split('#')

  return {
    pathname,
    search,
    hash
  }
}

function getCurrentLocation() {
  const currentLocation = browserHistory.getCurrentLocation()

  return `${currentLocation.pathname}${currentLocation.search}${
    currentLocation.hash
  }`
}

/**
 * Adds {from: "[CURRENT_LOCATION]"} to Link `to` prop.
 * @param {Link#propTypes.to} to
 * @returns {{pathname: string, search: string, hash: string}&{state: {from: string}}}
 */
function withFromState(to) {
  return typeof to === 'object'
    ? {
        ...to,
        state: { ...(to.state || {}), from: getCurrentLocation() }
      }
    : {
        ...getUrlParts(to || ''),
        state: {
          from: getCurrentLocation()
        }
      }
}
