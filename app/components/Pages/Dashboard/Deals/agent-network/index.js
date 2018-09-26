import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'

import config from '../../../../../../config/public'
import { loadJS } from '../../../../../utils/load-js'
import getPlace from '../../../../../models/listings/search/get-place'
import { getAddress } from '../../../../../models/Deal/context-helper'
import { byValert } from '../../../../../models/listings/search/get-listings'
import { selectDeal } from '../../../../../reducers/deals/list'
import getListing from '../../../../../models/listings/listing/get-listing'

import Header from '../../../../../views/components/PageHeader'

import { Grid } from './grid'
import { getMapBoundsInCircle } from './helpers'
import { valertOptions } from './helpers/valert-options'

class AgentNetwork extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isFetching: true,
      list: [],
      listInfo: {
        total: 0,
        count: 0,
        proposed_title: ''
      },
      selectedAgents: []
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
          points = getMapBoundsInCircle(location.center)

          if (deal.listing) {
            const listing = await getListing(deal.listing)

            const { property } = listing

            query = {
              ...valertOptions,
              points,
              architectural_style: property.architectural_style,
              minimum_bedrooms: property.bedroom_count,
              maximum_bedrooms: property.bedroom_count,
              minimum_bathrooms: property.full_bathroom_count,
              maximum_bathrooms: property.full_bathroom_count,
              property_subtype: [property.property_subtype],
              property_type: [property.property_type]
            }
          }
        }
      } else if (this.address) {
        const location = await getPlace(this.address)

        if (location) {
          points = getMapBoundsInCircle(location.center)

          query = {
            ...valertOptions,
            points
          }
        }
      }

      const response = await byValert(query)

      const list = this.createList(response.data)

      this.setState({ isFetching: false, list, listInfo: response.info })
    } catch (error) {
      console.log(error)
      this.setState({ isFetching: false })
      throw error
    }
  }

  createList = listings => {
    const initialList = {}

    const addTolist = (id, listing, type) => {
      if (initialList[id]) {
        initialList[id] = {
          ...initialList[id],
          listings: [...initialList[id].listings, listing]
        }
      } else {
        const {
          [`${type}_agent_mls_id`]: id,
          [`${type}_agent_full_name`]: name,
          [`${type}_office_name`]: company,
          [`${type}_agent_email`]: email,
          [`${type}_agent_direct_work_phone`]: phone
        } = listing

        initialList[id] = {
          id,
          name,
          company,
          email,
          phone,
          listings: [listing]
        }
      }
    }

    listings.forEach(listing => {
      const { list_agent_mls_id, selling_agent_mls_id } = listing

      if (list_agent_mls_id) {
        addTolist(list_agent_mls_id, listing, 'list')
      }

      if (selling_agent_mls_id && selling_agent_mls_id !== list_agent_mls_id) {
        addTolist(list_agent_mls_id, listing, 'selling')
      }
    })

    return Object.values(initialList).map(({ listings, ...rest }) => {
      const add = (accumulator, listing) => accumulator + listing.price
      const soldListings = listings.filter(l => l.status === 'sold')
      const soldListingsTotalValue = soldListings.reduce(add, 0)
      const listingsAveragePrice = listings.reduce(add, 0)

      const indexedList = {}

      listings.forEach(l => (indexedList[l.id] = l))

      return {
        ...rest,
        listings: indexedList,
        soldListings: soldListings.map(l => l.id),
        soldListingsTotalValue,
        listingsAveragePrice:
          listingsAveragePrice > 0 ? listingsAveragePrice / listings.length : 0
      }
    })
  }

  onChangeSelectedRows = selectedAgents =>
    this.setState({
      selectedAgents
    })

  render() {
    return (
      <React.Fragment>
        <Header
          title="Agent Network"
          subtitle={this.address}
          showBackButton={false}
        />

        <Grid
          data={this.state.list}
          deal={this.props.deal}
          isFetching={this.state.isFetching}
          onChangeSelectedRows={this.onChangeSelectedRows}
          selectedRows={this.state.selectedAgents}
          listInfo={this.state.listInfo}
        />
      </React.Fragment>
    )
  }
}

const mapStateToProps = (state, props) => ({
  deal: selectDeal(state.deals.list, props.params.id)
})

export default withRouter(connect(mapStateToProps)(AgentNetwork))
