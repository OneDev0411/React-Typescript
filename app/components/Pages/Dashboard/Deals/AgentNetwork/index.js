import React from 'react'
import { connect } from 'react-redux'
import { browserHistory, withRouter } from 'react-router'

import { Typography } from '@material-ui/core'

import Flex from 'styled-flex-component'

import { withTheme } from '@material-ui/styles'

import getPlace from 'models/listings/search/get-place'
import { getAddress } from 'models/Deal/helpers/context'
import getListing from 'models/listings/listing/get-listing'
import { byValert } from 'models/listings/search/get-listings'

import { selectDealById } from 'reducers/deals/list'

import { loadJS } from 'utils/load-js'
import { getMapBoundsInCircle } from 'utils/get-coordinates-points'

import { CloseButton } from 'components/Button/CloseButton'

import GlobalHeader from 'components/GlobalHeader'

import { GridContextProvider } from 'components/Grid/Table/context/provider'

import config from '../../../../../../config/public'

import Grid from './Grid'
import AreaFilter from './Filters/AreaFilter'
import { DEFAULT_RADIUS_FILTER } from './constants'
import { normalizeList } from './helpers/normalize-list'
import { valertOptions } from './helpers/valert-options'
import { filterNonMLSAgents } from './helpers/filter-non-mls-agents'

class AgentNetwork extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      address: props.location.query.address || '',
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
    const filter = DEFAULT_RADIUS_FILTER

    let query = null
    let location = null
    let listing = null

    try {
      if (deal) {
        const address = getAddress(deal)

        location = await getPlace(address)

        if (location) {
          if (deal.listing) {
            listing = await getListing(deal.listing)
          }

          this.setState({ address, listing, location })
          query = this.getQuery(listing, location, filter)
        }
      } else if (this.address) {
        location = await getPlace(this.address)
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
        return {
          points: null,
          mls_areas: filter.areas
        }
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
    if (!query) {
      return
    }

    try {
      this.setState({
        isFetching: true
      })

      const response = await byValert(
        query,
        null,
        false,
        '?associations[]=compact_listing.selling_agent&associations[]=compact_listing.list_agent'
      )

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
  }

  onSetFilter = filter => {
    const { listing, location } = this.state
    const query = this.getQuery(listing, location, filter)

    this.fetchAgents(query)
  }

  render() {
    return (
      <div style={{ margin: this.props.theme.spacing(5) }}>
        <GlobalHeader noGlobalActionsButton noPadding>
          <Flex spaceBetween>
            <Flex
              column
              style={{
                flexGrow: 1
              }}
            >
              <Typography variant="h4">Agent Network</Typography>
              <Typography
                variant="body1"
                style={{
                  color: this.props.theme.palette.grey[600]
                }}
              >
                {this.state.address}
              </Typography>
            </Flex>

            <div>
              <CloseButton
                backUrl={`/dashboard/deals/${this.props.deal.id}`}
                buttonProps={{
                  size: 'medium'
                }}
                iconProps={{
                  size: 'medium'
                }}
              />
            </div>
          </Flex>
        </GlobalHeader>

        <AreaFilter
          disabled={this.state.isFetching}
          handleSearch={this.onSetFilter}
        />
        <GridContextProvider>
          <Grid
            user={this.props.user}
            data={this.state.list.filter(filterNonMLSAgents)}
            deal={this.props.deal}
            isFetching={this.state.isFetching}
            listInfo={this.state.listInfo}
            onChangeSelectedRows={this.onChangeSelectedRows}
          />
        </GridContextProvider>
      </div>
    )
  }
}

const mapStateToProps = (state, props) => ({
  user: state.user,
  deal: selectDealById(state.deals.list, props.params.id)
})

export default withTheme(withRouter(connect(mapStateToProps)(AgentNetwork)))
