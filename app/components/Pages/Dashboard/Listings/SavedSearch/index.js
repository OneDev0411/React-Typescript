import React from 'react'
import { connect } from 'react-redux'
import { browserHistory, withRouter } from 'react-router'

import { getSavedSearchListings } from '../../../../../models/listings/alerts/get-alert-listings'
import { selectAlert } from '../../../../../reducers/listings/alerts/list'

import Map from './Map'
import { Header } from '../components/PageHeader'
import { MapView } from '../components/MapView'
import { GridView } from '../components/GridView'
import { GalleryView } from '../components/GalleryView'

const mappingStatus = status => {
  switch (status) {
    case 'New':
      return 'Have not Seen'
    case 'PriceDrop':
      return 'PRICE DROP'
    case 'StatusChange':
      return 'STATUS CHANGE'
    case 'OpenHouseAvailable':
      return 'OPEN HOUSE'
    default:
      return ''
  }
}

const normalize = rec => ({
  ...rec.listing,
  recId: rec.id,
  recRoom: rec.room,
  new: mappingStatus(rec.last_update),
  lat: rec.listing.property.address.location.latitude,
  lng: rec.listing.property.address.location.longitude
})

class SavedSearch extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      listings: {
        data: [],
        info: { total: 0 }
      },
      isFetching: false,
      activeView: props.location.query.view || 'map'
    }
  }

  componentDidMount() {
    this.fetchListings()
  }

  fetchListings = async () => {
    const { savedSearch } = this.props

    try {
      this.setState({ isFetching: true })

      const response = await getSavedSearchListings(
        savedSearch.id,
        savedSearch.room
      )

      this.setState({
        listings: {
          data: response.data.map(normalize),
          info: { total: response.info.total }
        },
        isFetching: false
      })
    } catch (error) {
      console.log(error)
      this.setState({ isFetching: false })
    }
  }

  onChangeView = e => {
    const activeView = e.currentTarget.dataset.view

    this.setState({ activeView }, () => {
      browserHistory.push(
        `/dashboard/mls/saved-searches/${
          this.props.savedSearch.id
        }?view=${activeView}`
      )
    })
  }

  renderMain() {
    const { listings, isFetching } = this.state

    switch (this.state.activeView) {
      case 'map':
        return (
          <MapView
            tabName="alerts"
            listings={listings}
            Map={
              <Map
                savedSearch={this.props.savedSearch}
                markers={listings.data}
                isFetching={isFetching}
              />
            }
          />
        )

      case 'gallery':
        return <GalleryView isFetching={isFetching} listings={listings} />

      default:
        return <GridView isFetching={isFetching} listings={listings} />
    }
  }

  render() {
    console.log(this.props.savedSearch)

    return (
      <React.Fragment>
        <Header
          title={this.props.savedSearch.title}
          subtitle={this.props.savedSearch.proposed_title}
          onChangeView={this.onChangeView}
          activeView={this.state.activeView}
          isSideMenuOpen={this.props.isSideMenuOpen}
          toggleSideMenu={this.props.toggleSideMenu}
        />
        {this.renderMain()}
      </React.Fragment>
    )
  }
}

const mapStateToProps = (state, props) => ({
  savedSearch: selectAlert(state.alerts.list, props.params.id)
})

export default withRouter(connect(mapStateToProps)(SavedSearch))
