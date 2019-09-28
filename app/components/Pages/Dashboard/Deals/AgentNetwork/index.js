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
import SearchAreaFilter from './SearchAreaFilter'
import { normalizeList } from './helpers/normalize-list'
import { valertOptions } from './helpers/valert-options'
import { filterNonMLSAgents } from './helpers/filter-non-mls-agents'

class AgentNetwork extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isFetching: true,
      location: null,
      listing: null,
      list: [],
      listInfo: {
        total: 0,
        count: 0
      }
    }
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
    const { deal } = this.props
    const filter = {
      type: 'radius',
      radius: 1
    }

    let query = null
    let location = null
    let listing = null

    try {
      if (deal) {
        location = await getPlace(getAddress(deal))

        if (location) {
          if (deal.listing) {
            listing = await getListing(deal.listing)
          }

          this.setState({ listing, location })
          query = this.getQuery(listing, location, filter)
        }
      } else if (this.props.location.query.address) {
        location = await getPlace(this.props.location.query.address)
        this.setState({ location })
        query = this.getQuery(listing, location, filter)
      }

      this.fetchAgents(query)
    } catch (error) {
      console.log(error)
      this.setState({ isFetching: false })
    }
  }

  getQuery = (listing, location, filter) => {
    let query

    const getSearchArea = () => {
      if (filter.type === 'radius') {
        return {
          points: getMapBoundsInCircle(location.center, filter.radius)
        }
      }

      if (filter.type === 'custom') {
        return {}
      }
    }

    if (listing) {
      const { property } = listing

      query = {
        ...valertOptions,
        ...getSearchArea(),
        architectural_style: property.architectural_style,
        minimum_bedrooms: property.bedroom_count,
        maximum_bedrooms: property.bedroom_count,
        minimum_bathrooms: property.full_bathroom_count,
        maximum_bathrooms: property.full_bathroom_count,
        property_subtype: [property.property_subtype],
        property_type: [property.property_type]
      }
    } else if (location) {
      query = {
        ...valertOptions,
        ...getSearchArea()
      }
    }

    return query
  }

  fetchAgents = async query => {
    console.log(query, this.state)

    if (!query) {
      return
    }

    try {
      this.setState({
        isFetching: true
      })

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
    }
  }

  onClose = () => {
    browserHistory.push(`/dashboard/deals/${this.props.deal.id}/marketing`)
    resetGridSelectedItems('agent_network')
  }

  onSetFilter = filter => {
    const { listing, location } = this.state
    const query = this.getQuery(listing, location, filter)

    this.fetchAgents(query)
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

        <SearchAreaFilter
          disabled={this.state.isFetching}
          handleSearch={this.onSetFilter}
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
