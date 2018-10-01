import React from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'

import { loadJS } from '../../../../../utils/load-js'
import { selectListings } from '../../../../../reducers/listings'
import searchActions from '../../../../../store_actions/listings/search'
import { toggleFilterArea } from '../../../../../store_actions/listings/search/filters/toggle-filters-area'

import Map from './components/Map'
import { MapView } from '../components/MapView'
import { bootstrapURLKeys } from '../mapOptions'
import { GridView } from '../components/GridView'
import { GalleryView } from '../components/GalleryView'
import CreateAlertModal from '../components/modals/CreateAlertModal'

import { Header } from './Header'

class Search extends React.Component {
  constructor(props) {
    super(props)

    const { query } = props.location

    this.searchQuery = query.q || ''

    let activeView = query.view

    if (!activeView) {
      activeView = props.user.user_type === 'Agent' ? 'grid' : 'map'
    }

    this.state = {
      activeView,
      shareModalIsActive: false,
      mapWithQueryIsInitialized: !this.searchQuery
    }
  }

  componentDidMount() {
    if (!window.google) {
      loadJS(
        `https://maps.googleapis.com/maps/api/js?key=${
          bootstrapURLKeys.key
        }&libraries=${bootstrapURLKeys.libraries},`
      )
    }

    if (this.searchQuery) {
      this._findPlace(this.searchQuery)
    }
  }

  async _findPlace(address) {
    const { searchByMlsNumber, searchByPostalCode, getPlace } = this.props

    const initMap = () => this.setState({ mapWithQueryIsInitialized: true })

    try {
      if (/^\d{5}(?:[-\s]\d{4})?$/.test(address)) {
        initMap()
        searchByPostalCode(address)
      }

      if (!Number.isNaN(address) && address.length > 7) {
        initMap()
        searchByMlsNumber(address)
      }

      await getPlace(address)
      initMap()
    } catch ({ message }) {
      initMap()
    }
  }

  onChangeView = e => {
    const activeView = e.currentTarget.dataset.view

    this.setState({ activeView }, () => {
      browserHistory.push(`/dashboard/mls?view=${activeView}`)
    })
  }

  shareModalCloseHandler = () => this.setState({ shareModalIsActive: false })
  shareModalActiveHandler = () => this.setState({ shareModalIsActive: true })

  renderMain() {
    const _props = {
      user: this.props.user,
      listings: this.props.listings,
      isFetching: this.props.isFetching,
      isWidget: this.props.isWidget
    }

    switch (this.state.activeView) {
      case 'map':
        return (
          <MapView
            {..._props}
            Map={
              this.state.mapWithQueryIsInitialized ? <Map {..._props} /> : null
            }
          />
        )

      case 'gallery':
        return <GalleryView {..._props} />

      default:
        return <GridView {..._props} />
    }
  }

  render() {
    const { user } = this.props

    return (
      <React.Fragment>
        <Header
          user={user}
          isFetching={this.props.isFetching}
          filtersIsOpen={this.props.filtersIsOpen}
          activeView={this.state.activeView}
          isSideMenuOpen={this.props.isSideMenuOpen}
          toggleSideMenu={this.props.toggleSideMenu}
          saveSearchHandler={this.shareModalActiveHandler}
          onClickFilter={this.props.toggleFilterArea}
          onChangeView={this.onChangeView}
          hasData={this.props.listings.data.length > 0}
        />
        {this.renderMain()}
        <CreateAlertModal
          user={user}
          onHide={this.shareModalCloseHandler}
          isActive={this.state.shareModalIsActive}
          alertProposedTitle={this.props.listings.info.proposed_title}
        />
      </React.Fragment>
    )
  }
}

const mapStateToProps = ({ user, search }) => {
  const { listings } = search

  return {
    user,
    isLoggedIn: user || false,
    isFetching: listings.isFetching,
    filtersIsOpen: search.filters.isOpen,
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

// todo: detect view from url
