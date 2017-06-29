import React, { Component } from 'react'
import ListingCard from './ListingCard'
import S from 'shorti'
import controller from '../../../Dashboard/controller'

import { Button } from 'react-bootstrap'
import ListingDispatcher from '../../../../../dispatcher/ListingDispatcher'
import Loading from '../../../../Partials/Loading'
import AppStore from '../../../../../stores/AppStore'
import Brand from '../../../../../controllers/Brand'

export default class Section extends Component {

  constructor() {
    super()
    this.state = {
      listings: [],
      isLoading: true
    }
  }

  componentWillMount() {
    AppStore.data.is_widget = true
    AppStore.emitChange()
  }

  componentDidMount() {
    const data = this.props.data
    const user = data.user
    // Set user
    AppStore.data.user = user
    const location = data.location
    const brokerage = location.query.brokerage
    const agent = location.query.agent
    const brand = location.query.brand
    this.options = this.initOptions(brokerage, agent, this.props.type, brand)
    AppStore.data.widget = {
      options: this.options
    }
    if (!AppStore.data.widget) {
      AppStore.data.widget = {}
    }
    if (!AppStore.data.widget[this.props.type]) {
      AppStore.data.widget[this.props.type] = {}
    }
    AppStore.data.widget[this.props.type].is_loading_listings = true
    AppStore.emitChange()
    ListingDispatcher.dispatch({
      action: 'get-valerts-widget',
      user,
      options: this.options
    })
    if (user) {
      ListingDispatcher.dispatch({
        action: 'get-favorites',
        user
      })
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.data.widget[this.options.type]
      && nextProps.data.widget[this.options.type].listings
    ) {
      this.setState({
        listings: nextProps.data.widget[this.options.type].listings,
        isLoading: nextProps.data.widget[nextProps.type].is_loading_listings
      })
    }
  }

  shouldComponentUpdate(nextProps, nextStates) {
    return (
      nextStates.isLoading !== this.state.isLoading
      || nextStates.listings.length !== this.state.listings.length
    )
  }

  handleListingClick(listing) {
    const url = `/dashboard/mls/${listing.id}`
    window.open(url, '_blank')
  }

  initOptions(brokerage, agent, type, brand) {
    const options = {
      limit: '75',
      property_types: ['Residential', 'Residential Lease', 'Lots & Acreage'],
      listing_statuses: ['Active', 'Active Contingent', 'Active Kick Out', 'Active Option Contract', 'Pending'],
      property_subtypes: ['RES-Single Family', 'RES-Half Duplex', 'RES-Farm\/Ranch', 'RES-Condo', 'RES-Townhouse', 'LSE-Apartment', 'LSE-Condo/Townhome', 'LSE-Duplex', 'LSE-Fourplex', 'LSE-House', 'LSE-Mobile', 'LSE-Triplex', 'LND-Commercial', 'LND-Farm/Ranch', 'LND-Residential']
    }
    if (brokerage)
      options.list_offices = [brokerage]
    if (agent)
      options.agents = [agent]
    if (brand)
      options.brand = brand
    return options
  }

  triggerNextPage() {
    const data = this.props.data
    const user = data.user
    // const options = data.widget.options
    // this.options.limit = +this.options.limit + 10
    AppStore.data.widget.options = this.options
    AppStore.data.widget[this.props.type].is_loading_listings = true
    AppStore.emitChange()
    ListingDispatcher.dispatch({
      action: 'page-listings-widget',
      user,
      options: this.options
    })
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.data.widget[this.options.type]
      && nextProps.data.widget[this.options.type].listings
    ) {
      this.setState({
        listings: nextProps.data.widget[this.options.type].listings
      })
    }
  }
  shouldComponentUpdate(nextProps, nextStates) {
    if (nextProps.data.widget && nextProps.data.widget[nextProps.type]) {
      nextProps.data.widget[nextProps.type].is_loading_listings
    }
    return (
      (nextProps.data.widget && nextProps.data.widget[nextProps.type] && nextProps.data.widget[nextProps.type].is_loading_listings)
      || nextStates.listings.length !== this.state.listings.length
    )
  }

  componentDidUpdate() {
    parent.postMessage({ height: this.parentDiv.scrollHeight }, '*')
  }

  render() {
    let showLoadMore = false
    console.log(this.props.type, showLoadMore)

    if (
      this.props.data.widget
      && this.props.data.widget[this.props.type]
      && this.props.data.widget[this.props.type].listings_info
      && this.props.data.widget[this.props.type].listings_info.total > this.state.listings.length
    ) {
      console.log(this.props.type, false)
      showLoadMore = true
    }
    return (
      <div className="futurastd listing-section">
        <div
          style={{
            textAlign: 'center',
            backgroundColor: '#fbfbfb',
            display: 'table',
            width: '100%'
          }}
        >
          <h1
            style={S(`font-50 color-263445 mb-0${this.props.data.is_mobile ? ' ml-10 mr-10' : ''}`)}
          >{this.props.title}</h1>
          <span style={S('h-1 bg-e2e2e2 w-80 m-20 inline-block')} />
        </div>
        {this.state.listings && this.state.listings.map((listing, i) => (
          <ListingCard
            className="listing-card"
            handleEmailSubmit={controller.action_bubble.handleEmailSubmit}
            key={i}
            data={this.props.data}
            listing={listing}
            handleCloseSignupForm={controller.action_bubble.handleCloseSignupForm}
            handleListingClick={this.handleListingClick}
            handleAgentClick={controller.action_bubble.handleAgentClick}
            handleListingInquirySubmit={controller.action_bubble.handleListingInquirySubmit}
            handleLoginClick={controller.action_bubble.handleLoginClick}
            showIntercom={controller.action_bubble.showIntercom}
            resend={controller.action_bubble.resend}
            hideModal={controller.action_bubble.hideModal}
          />
        ))
        }
        <div className="clearfix" />
        {
          this.state.isLoading &&
          <div style={S('text-center')}>
            <Loading />
          </div>
        }
        {Brand.color('primary') && showLoadMore &&
          <div style={S('text-center')}>
            <Button
              onClick={this.triggerNextPage.bind(this, 'active')}
              style={{
                backgroundColor: `#${Brand.color('primary')}`,
                borderColor: `#${Brand.color('primary')}`,
                paddingLeft: '3em',
                paddingRight: '3em',
                fontSize: '1.2em'
              }}
              bsStyle="primary"
            >
              Load More
          </Button>
          </div>
        }
      </div>
    )
  }
}

// Section.propTypes = {
//   emails: React.PropTypes.array.isRequired
// }
//
// Section.defaultProps = {
//   emails: React.PropTypes.array.isRequired
// }

// export default Section