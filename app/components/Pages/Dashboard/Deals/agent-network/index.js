import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'

import config from '../../../../../../config/public'
import { loadJS } from '../../../../../utils/load-js'
import { getMapBoundsInCircle } from '../../../../../utils/get-coordinates-points'
import getPlace from '../../../../../models/listings/search/get-place'
import { getAddress } from '../../../../../models/Deal/context-helper'
import { byValert } from '../../../../../models/listings/search/get-listings'
import { selectDeal } from '../../../../../reducers/deals/list'
import getListing from '../../../../../models/listings/listing/get-listing'

import Header from '../../../../../views/components/PageHeader'

import { Grid } from './grid'
import { normalizeList } from './helpers/normalize-list'
import { valertOptions } from './helpers/valert-options'

class AgentNetwork extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      query: {},
      isFetching: true,
      isFetchingMore: false,
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
        list,
        query
      })
    } catch (error) {
      console.log(error)
      this.setState({ isFetching: false })
      throw error
    }
  }

  handleLoadMore = async () => {
    const offset = this.state.listInfo.count + 1

    if (this.state.isFetchingMore || offset === this.state.listInfo.total) {
      return false
    }

    // console.log(`[ Loading More ] Start: ${offset}`)

    this.setState({ isFetchingMore: true })

    try {
      const response = await byValert(this.state.query, { offset }, false)

      const list = normalizeList(response.data)

      this.setState(state => ({
        isFetchingMore: false,
        listInfo: {
          total: state.listInfo.total,
          count: state.listInfo.count + response.info.count
        },
        list: [...state.list, ...list].sort(
          (a, b) => b.listingsCount - a.listingsCount
        )
      }))
    } catch (error) {
      console.log(error)
      this.setState({ isFetchingMore: false })
      throw error
    }
  }

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
          isFetchingMore={this.state.isFetchingMore}
          onRequestLoadMore={this.handleLoadMore}
          onChangeSelectedRows={this.onChangeSelectedRows}
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
