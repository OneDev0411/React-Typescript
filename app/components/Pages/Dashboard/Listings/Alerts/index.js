import { connect } from 'react-redux'
import React, { Component } from 'react'

import Map from './components/Map'
import AlertsList from './components/AlertsList'
import Loading from '../../../../Partials/Loading'
import ListingsPanel from '../components/ListingsPanels'
import getAlerts from '../../../../../store_actions/listings/alerts/get-alerts'
import { selectListings as selectAlerts } from '../../../../../reducers/listings'

class Alerts extends Component {
  componentDidMount() {
    const { alertsList, isFetching, getAlerts } = this.props

    if (!isFetching && !alertsList.data.length) {
      console.log('get alerts')
      getAlerts()
    }
  }

  render() {
    const { isLoggedIn, alertsList, activePanel, isFetching } = this.props

    return (
      <div className="l-listings__main l-listings__main--alert clearfix">
        <div className="l-listings__alert-list">
          <AlertsList alertsList={alertsList} />
          {isFetching && <Loading />}
        </div>
        {/*<div className="l-listings__map">
          <Map markers={[]} />
          <ListingsPanel
            tabName="ALERTS"
            listings={alertsList}
            isLoggedIn={isLoggedIn}
            activePanel={activePanel}
          />
        </div>*/}
      </div>
    )
  }
}

const mapStateToProps = ({ data, alerts }) => {
  const { list, panels } = alerts

  return {
    isFetching: list.isFetching,
    isLoggedIn: data.user || false,
    activePanel: panels.activePanel,
    alertsList: { data: selectAlerts(list) }
  }
}

export default connect(mapStateToProps, { getAlerts })(Alerts)
