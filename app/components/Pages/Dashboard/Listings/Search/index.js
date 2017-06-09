import _ from 'lodash'
import { connect } from 'react-redux'
import React, { Component } from 'react'

import Map from './components/Map'
import Loading from '../components/Loading'
import SearchToolbar from './components/SearchToolbar'
import { getListings } from '../../../../../reducers/listings'

import * as searchActions from
  '../../../../../store_actions/listings/search'
import * as favoritesActions from
  '../../../../../store_actions/listings/favorites'

if (typeof window !== 'undefined') {
  window.requestIdleCallback = window.requestIdleCallback ||
    function rIC(cb) {
      return setTimeout(() => {
        const start = Date.now()
        cb({
          didTimeout: false,
          timeRemaining: () => Math.max(0, 50 - (Date.now() - start))
        })
      }, 1)
    }

  window.cancelIdleCallback = window.cancelIdleCallback ||
    function rIC(cb) { return clearTimeout(id) }
}

const actions = {
  ...searchActions,
  ...favoritesActions
}

let mapOnChangeDebounce = 0

class Search extends Component {
  componentDidMount() {
    this._fetchFavorites()
  }

  componentWillReceiveProps(nextProps) {
    this._fetchSearchListings(nextProps)
  }

  _fetchSearchListings(nextProps) {
    const { mapProps: nextMapProps } = nextProps
    const { mapProps, fetchListings } = this.props

    if (!_.isEqual(mapProps, nextMapProps)) {
      if (!mapOnChangeDebounce) {
        mapOnChangeDebounce = 1
        fetchListings(nextMapProps)
      } else {
        clearTimeout(mapOnChangeDebounce)
        mapOnChangeDebounce = setTimeout(() => {
          fetchListings(nextMapProps)
          clearTimeout(mapOnChangeDebounce)
        }, 300)
      }
    }
  }

  _fetchFavorites() {
    if ('requestIdleCallback' in window) {
      const {
        user,
        fetchFavorites,
        favoritesListings
      } = this.props

      if (!favoritesListings.length) {
        fetchFavorites(user)
      }
    }
  }

  render() {
    return (
      <div>
        {this.props.isFetching && <Loading text="MLS®" />}
        <Map {...this.props} />
        <SearchToolbar />
      </div>
    )
  }
}

const mapStateToProps = ({
  data,
  search,
  favorites
}) => {
  const { listings: searchListings, map } = search
  const { listings: favoritesListings } = favorites
  return ({
    map,
    user: data.user,
    mapProps: map.props,
    markers: getListings(searchListings),
    isFetching: searchListings.isFetching,
    favoritesListings: getListings(favoritesListings)
  })
}

export default connect(
  mapStateToProps,
  actions
)(Search)
