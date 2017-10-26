import _ from 'lodash'
import { connect } from 'react-redux'
import React, { Component } from 'react'

import Map from './components/Map'
import Filters from './components/Filters'
import Loading from '../components/Loading'
import SearchToolbar from './components/SearchToolbar'
import ListingsPanel from '../components/ListingsPanels'
import CreateAlertModal from '../components/modals/CreateAlertModal'
import { selectListings } from '../../../../../reducers/listings'
import getListingsByMapBounds from '../../../../../store_actions/listings/search/get-listings/by-map-bounds'
import searchActions from '../../../../../store_actions/listings/search'

let mapOnChangeDebounce = 0

class Search extends Component {
  constructor(props) {
    super(props)

    const { location } = props

    this.searchQuery =
      location && location.query && location.query.q ? location.query.q : ''

    this.state = {
      shareModalIsActive: false,
      mapWithQueryIsInitialized: !this.searchQuery
    }

    this.shareModalCloseHandler = this.shareModalCloseHandler.bind(this)
    this.shareModalActiveHandler = this.shareModalActiveHandler.bind(this)
  }

  componentDidMount() {
    if (this.searchQuery) {
      this._findPlace(this.searchQuery)
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.searchQuery && !this.state.mapWithQueryIsInitialized) {
      return
    }

    this._fetchListings(nextProps)
  }

  async _findPlace(address) {
    const { searchByMlsNumber, searchByPostalCode, getPlace } = this.props

    const initMap = () => {
      this.setState({ mapWithQueryIsInitialized: true })
    }

    try {
      if (/^\d{5}(?:[-\s]\d{4})?$/.test(address)) {
        initMap()
        searchByPostalCode(address)
      }

      if (!isNaN(address) && address.length > 7) {
        initMap()
        searchByMlsNumber(address)
      }

      await getPlace(address)
      initMap()
    } catch ({ message }) {
      initMap()
    }
  }

  _fetchListings(nextProps) {
    const { mapProps: nextMapProps } = nextProps
    const { mapProps, getListingsByMapBounds } = this.props

    if (!_.isEqual(mapProps, nextMapProps)) {
      if (!mapOnChangeDebounce) {
        mapOnChangeDebounce = 1
        getListingsByMapBounds(nextMapProps.bounds)
      } else {
        clearTimeout(mapOnChangeDebounce)
        mapOnChangeDebounce = setTimeout(() => {
          getListingsByMapBounds(nextMapProps.bounds)
          clearTimeout(mapOnChangeDebounce)
        }, 300)
      }
    }
  }

  shareModalCloseHandler() {
    this.setState({
      shareModalIsActive: false
    })
  }

  shareModalActiveHandler() {
    this.setState({
      shareModalIsActive: true
    })
  }

  render() {
    const {
      data,
      user,
      isWidget,
      listings,
      isFetching,
      isLoggedIn,
      activePanel,
      filterAreaIsOpen
    } = this.props

    return (
      <div className="l-listings__main clearfix">
        <div className="l-listings__map">
          {this.state.mapWithQueryIsInitialized && <Map {...this.props} />}
          <SearchToolbar />
          <Filters isOpen={filterAreaIsOpen} isSubmitting={isFetching} />
          {isFetching && <Loading text="MLS®" />}
        </div>
        <div className="l-listings__panel">
          <ListingsPanel
            tabName="SEARCH"
            isWidget={isWidget}
            listings={listings}
            isLoggedIn={isLoggedIn}
            activePanel={activePanel}
            onClickShare={this.shareModalActiveHandler}
          />
        </div>
        <CreateAlertModal
          user={user}
          onHide={this.shareModalCloseHandler}
          isActive={this.state.shareModalIsActive}
          alertProposedTitle={listings.info.proposed_title}
        />
      </div>
    )
  }
}

const mapStateToProps = ({ user, data, search }) => {
  const { listings, map, panels, filters } = search

  return {
    map,
    user,
    data,
    mapProps: map.props,
    isLoggedIn: user || false,
    activePanel: panels.activePanel,
    isFetching: listings.isFetching,
    filterAreaIsOpen: filters.isOpen,
    listings: {
      data: selectListings(listings),
      info: listings.info
    }
  }
}

export default connect(mapStateToProps, {
  ...searchActions,
  getListingsByMapBounds
})(Search)
