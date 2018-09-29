import { connect } from 'react-redux'
import React, { Component } from 'react'

import Map from './components/Map'
import { Header } from './Header'
import Loading from '../components/Loading'
import ListingsPanel from '../components/ListingsPanels'
import CreateAlertModal from '../components/modals/CreateAlertModal'
import { selectListings } from '../../../../../reducers/listings'
import searchActions from '../../../../../store_actions/listings/search'
import { toggleFilterArea } from '../../../../../store_actions/listings/search/filters/toggle-filters-area'

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
    const { user, isWidget, listings, isFetching, isLoggedIn } = this.props

    return (
      <div>
        <Header
          user={user}
          isFetching={isFetching}
          filtersIsOpen={this.props.filtersIsOpen}
          activePanel={this.props.activePanel}
          isSideMenuOpen={this.props.isSideMenuOpen}
          toggleSideMenu={this.props.toggleSideMenu}
          saveSearchHandler={this.shareModalActiveHandler}
          onClickFilter={this.props.toggleFilterArea}
        />
        <div className="l-listings__main clearfix">
          <div className="l-listings__map">
            {this.state.mapWithQueryIsInitialized && <Map {...this.props} />}
            {isFetching && <Loading text="MLS®" />}
          </div>
          <div className="l-listings__panel">
            <ListingsPanel
              tabName="search"
              isWidget={isWidget}
              listings={listings}
              isLoggedIn={isLoggedIn}
            />
          </div>
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
    filtersIsOpen: filters.isOpen,
    listings: {
      data: selectListings(listings),
      info: listings.info
    }
  }
}

export default connect(
  mapStateToProps,
  {
    ...searchActions,
    toggleFilterArea
  }
)(Search)
