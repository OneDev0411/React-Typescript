import React from 'react'
import { connect } from 'react-redux'
import { browserHistory, withRouter } from 'react-router'

import { getAddress } from 'models/Deal/helpers/context'

import getPlace from 'models/listings/search/get-place'

import { getMapBoundsInCircle } from 'utils/get-coordinates-points'
import { byValert } from 'models/listings/search/get-listings'
import { selectDealById } from 'reducers/deals/list'
import getListing from 'models/listings/listing/get-listing'

import Header from 'components/PageHeader'
import { resetGridSelectedItems } from 'components/Grid/Table/Plugins/Selectable'

import { loadJS } from '../../../../../utils/load-js'

import config from '../../../../../../config/public'

import { Grid } from './Grid'
import { normalizeList } from './helpers/normalize-list'
import { valertOptions } from './helpers/valert-options'
import { filterNonMLSAgents } from './helpers/filter-non-mls-agents'

class AgentNetwork extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isFetching: true,
      list: [],
      listInfo: {
        total: 0,
        count: 0
      }
    }

    this.address = props.location.query.address || ''
  }

  componentDidMount() {
    window.initializeAgentNetworkList = this.initialize

    loadJS(
      `https://maps.googleapis.com/maps/api/js?key=${
        config.google.api_key
      }&libraries=geometry&callback=initializeAgentNetworkList`
    )
  }

  initialize = async () => {
    let points
    let query
    const { deal } = this.props

    try {
      if (deal) {
        this.address = getAddress(deal)

        const location = await getPlace(this.address)

        if (location) {
          if (deal.listing) {
            const listing = await getListing(deal.listing)

            const { property } = listing

            query = {
              ...valertOptions,
              architectural_style: property.architectural_style,
              minimum_bedrooms: property.bedroom_count,
              maximum_bedrooms: property.bedroom_count,
              minimum_bathrooms: property.full_bathroom_count,
              maximum_bathrooms: property.full_bathroom_count,
              property_subtype: [property.property_subtype],
              property_type: [property.property_type],
              points: getMapBoundsInCircle(location.center, 1)
            }
          }
        }
      } else if (this.address) {
        const location = await getPlace(this.address)

        if (location) {
          points = getMapBoundsInCircle(location.center, 1)

          query = {
            ...valertOptions,
            points
          }
        }
      }

      const response = await byValert(query, null, false)

      const list = normalizeList(response.data).sort(
        (a, b) => b.listingsCount - a.listingsCount
      )

      this.setState({
        isFetching: false,
        listInfo: {
          count: response.info.count,
          total: response.info.total
        },
        list
      })
    } catch (error) {
      console.log(error)
      this.setState({ isFetching: false })
      throw error
    }
  }

  onClose = () => {
    browserHistory.push(`/dashboard/deals/${this.props.deal.id}/marketing`)
    resetGridSelectedItems('agent_network')
  }

  render() {
    return (
      <React.Fragment>
        <Header
          title="Agent Network"
          subtitle={this.address}
          showBackButton={false}
          onClickCloseButton={this.onClose}
        />

        <Grid
          data={this.state.list.filter(filterNonMLSAgents)}
          deal={this.props.deal}
          isFetching={this.state.isFetching}
          onChangeSelectedRows={this.onChangeSelectedRows}
          listInfo={this.state.listInfo}
        />
      </React.Fragment>
    )
  }
}

const mapStateToProps = (state, props) => ({
  deal: selectDealById(state.deals.list, props.params.id)
})

export default withRouter(connect(mapStateToProps)(AgentNetwork))
