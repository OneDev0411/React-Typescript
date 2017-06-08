import _ from 'lodash'
import { connect } from 'react-redux'
import React, { Component } from 'react'

import GMap from './GMap'
import Loading from '../components/Loading'
import * as actions from
  '../../../../../store_actions/listings/search'
import { getListings } from '../../../../../reducers/listings'

let mapOnChangeDebounce = 0

class Search extends Component {

  componentWillReceiveProps(nextProps) {
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

  render() {
    return (
      <div>
        {this.props.isFetching && <Loading text="MLS®" />}
        <GMap {...this.props} />
      </div>
    )
  }
}

const mapStateToProps = ({
  search
}) => {
  const { listings, map } = search
  return ({
    map,
    mapProps: map.props,
    markers: getListings(listings),
    isFetching: listings.isFetching
  })
}

export default connect(
  mapStateToProps,
  actions
)(Search)
