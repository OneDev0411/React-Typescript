import { connect } from 'react-redux'
import React, { Component } from 'react'

import GMap from './GMap'
import Loading from '../components/Loading'
import * as actions from
  '../../../../../store_actions/listings/search'
import { getListings } from '../../../../../reducers/listings'

class Search extends Component {
  componentDidMount() {
    const { listings, isFetching } = this.props

    if (!isFetching && !listings.length) {
      this.fetchData()
    }
  }

  fetchData() {
    const {
      mapProps,
      fetchListings
    } = this.props

    fetchListings(mapProps)
  }

  render() {
    const {
      listings,
      isFetching
    } = this.props

    return (
      <div>
        {isFetching && <Loading text="MLS®" />}
        <GMap />
      </div>
    )
  }
}

const mapStateToProps = ({
  search
}) => {
  const { listings } = search
  return ({
    mapProps: search.mapProps,
    listings: getListings(listings),
    isFetching: listings.isFetching
  })
}

export default connect(
  mapStateToProps,
  actions
)(Search)
