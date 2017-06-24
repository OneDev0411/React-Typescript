import { connect } from 'react-redux'
import React, { Component } from 'react'

import Map from './components/Map'
import AlertsList from './components/AlertsList'
import Loading from '../components/Loading'
import { Spinner } from '../../../../Partials/Loading'
import ListingsPanel from '../components/ListingsPanels'
import getAlerts from '../../../../../store_actions/listings/alerts/get-alerts'
import { selectListings as selectAlerts } from '../../../../../reducers/listings'

class Alerts extends Component {
  componentDidMount() {
    const { alertsList, isFetching, getAlerts } = this.props

    if (!isFetching && !alertsList.data.length) {
      getAlerts()
    }
  }

  render() {
    const {
      feed,
      isLoggedIn,
      alertsList,
      activePanel,
      selectedAlert,
      feedIsFetching,
      alertsListIsFetching
    } = this.props

    return (
      <div className="l-listings__main l-listings__main--alert clearfix">
        <div className="l-listings__alert-list">
          <AlertsList alertsList={alertsList} />
          {alertsListIsFetching && <Spinner />}
        </div>
        <div className="l-listings__map">
          <Map markers={feed} selectedAlert={selectedAlert} />
          <ListingsPanel
            tabName="ALERTS"
            listings={{ data: feed }}
            isLoggedIn={isLoggedIn}
            activePanel={activePanel}
          />
          {feedIsFetching && <Loading text="Alert" />}
        </div>
      </div>
    )
  }
}

const mapStateToProps = ({ data, alerts }) => {
  const { list, panels, feed, selectedAlertId } = alerts
  const selectedAlert = list.byId[selectedAlertId]

  let selectedAlertListings = []
  const feedIsFetching = feed.isFetching
  const feedIsLoaded = Object.keys(feed.byAlertId).length > 0
  if (selectedAlertId && feedIsLoaded && !feedIsFetching) {
    selectedAlertListings = feed.byAlertId[selectedAlertId] || []
  }

  return {
    selectedAlert,
    feedIsFetching,
    feed: selectedAlertListings,
    isLoggedIn: data.user || false,
    activePanel: panels.activePanel,
    alertsListIsFetching: list.isFetching,
    alertsList: { data: selectAlerts(list) }
  }
}

export default connect(mapStateToProps, { getAlerts })(Alerts)
