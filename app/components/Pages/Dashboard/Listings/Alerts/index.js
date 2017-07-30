import React, { Component } from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'

import Map from './components/Map'
import AlertsList from './components/AlertsList'
import Loading from '../components/Loading'
import { Spinner } from '../../../../Partials/Loading'
import ListingsPanel from '../components/ListingsPanels'
import DeleteAlertModal from './components/DeleteAlertModal'

import actions from '../../../../../store_actions/listings/alerts'
import { selectListings as selectAlerts } from '../../../../../reducers/listings'

class Alerts extends Component {
  constructor(props) {
    super(props)

    this.state = {
      alertSelectedForDelete: null
    }

    this.deleteAlertModalCloseHandler = this.deleteAlertModalCloseHandler.bind(
      this
    )
    this.deleteAlertModalShowHandler = this.deleteAlertModalShowHandler.bind(
      this
    )
  }

  componentDidMount() {
    const {
      params,
      getAlerts,
      alertsList,
      isFetching,
      getAlertFeed,
      selectedAlert,
      clearAlertNotification
    } = this.props

    if (!isFetching && !alertsList.data.length) {
      getAlerts().then(response => {
        if (params.alertId) {
          const alert = response.entities.listings[params.alertId]
          const { id, room, new_recommendations } = alert

          getAlertFeed(id, room)

          if (parseInt(new_recommendations, 10) > 0) {
            setTimeout(() => clearAlertNotification(id, room), 5000)
          }
        }
      })
    }

    if (
      selectedAlert &&
      window.location.pathname.indexOf(selectedAlert.id) === -1
    ) {
      browserHistory.push(`/dashboard/mls/alerts/${selectedAlert.id}`)
    }
  }

  deleteAlertModalShowHandler(alertSelectedForDelete) {
    this.setState({
      alertSelectedForDelete
    })
  }

  deleteAlertModalCloseHandler() {
    this.setState({
      alertSelectedForDelete: null
    })
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
          <AlertsList
            alertsList={alertsList}
            onClickDeleteAlert={this.deleteAlertModalShowHandler}
          />
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
        <DeleteAlertModal
          alert={this.state.alertSelectedForDelete}
          onHide={this.deleteAlertModalCloseHandler}
        />
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

export default connect(mapStateToProps, actions)(Alerts)
