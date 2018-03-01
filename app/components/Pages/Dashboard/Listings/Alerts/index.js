import React, { Component } from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'

import Map from './components/Map'
import Loading from '../components/Loading'
import AlertsList from './components/AlertsList'
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
    this.props.getAlerts()
  }

  componentWillReceiveProps(nextProps) {
    const { alertsList, selectedAlert, isFetching } = nextProps
    const alert =
      selectedAlert || (alertsList.data.length > 0 && alertsList.data[0])

    if (alert && !isFetching) {
      this._getAlertFeed(alert)
    }
  }

  async _getAlertFeed(alert) {
    const { getAlertFeed, clearAlertNotification } = this.props
    const { id, room, new_recommendations } = alert

    await getAlertFeed(id, room)

    if (parseInt(new_recommendations, 10) > 0) {
      setTimeout(() => clearAlertNotification(id, room), 5000)
    }

    if (window.location.pathname.indexOf(id) === -1) {
      browserHistory.push(`/dashboard/mls/alerts/${id}`)
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
          <div style={{ position: 'relative' }}>
            {alertsListIsFetching && <Spinner />}
          </div>
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
    alertsList: { data: selectAlerts(list), info: list.info }
  }
}

export default connect(mapStateToProps, actions)(Alerts)
