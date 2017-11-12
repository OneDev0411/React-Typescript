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
import searchActions from '../../../../../store_actions/listings/search'

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

const mapStateToProps = ({ user, search }) => {
  const { listings, map, panels, filters } = search

  return {
    map,
    user,
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
  ...searchActions
})(Search)
