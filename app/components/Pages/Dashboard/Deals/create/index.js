import React from 'react'
import { browserHistory } from 'react-router'
import { Grid, Row, Col, Button, FormControl, Modal } from 'react-bootstrap'
import Rx from 'rxjs/Rx'
import _ from 'underscore'

import Deal from '../../../../../models/Deal'
import listingsHelper from '../../../../../utils/listing'
import CreateModal from './modal'
import PlacesView from './places_view'
import ListingsView from './listings_view'
import { createDeal } from '../../../../../store_actions/deals'

export default class DealCreate extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      address: '',
      selected: null,
      listings: {},
      places: {},
      searching: false
    }
  }

  componentDidMount() {
    const { Observable } = Rx

    this.searchHandler = Observable
      .fromEvent(this.search_input, 'keypress')
      .debounceTime(1200)
      .subscribe((e) => this.search(e.target.value))
  }

  componentWillUnmount() {
    this.searchHandler.unsubscribe()
  }

  /**
   * triggers when user types address
   */
  onChangeAddress(e) {
    const address = e.target.value

    this.setState({
      address,
      selected: null
    })
  }

  /**
   * search address inside google places and rechat listings
   */
  async search(address) {
    if (address.length === 0) {
      return false
    }

    const type = this.props.params.type
    let listings
    let places

    // show loading
    this.setState({ searching: true })

    try {
      let response

      // search in mls listings
      if (type === 'offer') {
        response = await Deal.searchListings(address)
        listings = this.createList(response.data, 'offer')
      }

      // get google results
      response = await Deal.searchPlaces(address)
      places = this.createList(response.results, 'listing')

      // hide loading
      this.setState({
        listings,
        places,
        searching: false
      })
    }
    catch(e) {
      this.setState({ searching: false })
      return
    }
  }

  /**
   * normalize and integrate google places and rechat listings list
   */
  createList(data, type) {
    const list = []

    if (type === 'listing') {
       _.each(data, item => {

        list.push({
          full_address: item.formatted_address
        })
      })
    }

    if (type === 'offer') {
       _.each(data, item => {
        list.push({
          isListing: true,
          id: item.id,
          full_address: listingsHelper.addressTitle(item.address),
          address_components: item.address,
          price: item.price,
          status: item.status,
          image: item.cover_image_url
        })
      })
    }

    return list
  }

  /**
   * on user selects a place or listing
   */
  onPlaceSelect(item) {
    this.setState({
      selected: item,
      address: item.full_address
    })
  }

  render() {
    const { params } = this.props
    const { address, listings, places, searching, selected } = this.state

    return (
      <div className="deal-create">
        <span className="title">
          { params.type === 'listing' ? 'New listing' : 'Make an offer' }
        </span>

        <FormControl
          className="address"
          value={address}
          onChange={(e) => this.onChangeAddress(e)}
          inputRef={ref => this.search_input = ref}
          placeholder={
            params.type === 'listing' ?
            'Enter full listing address' :
            'Enter full listing’s address or MLS #'
          }
        />

        {
          address.length > 0 &&
          <div className="places">
            <div>
              <img src="/static/images/deals/home.svg" />
              <span className="address">“{ address }”</span>

              <CreateModal
                type={params.type}
                side={params.type === 'offer' ? 'Buying' : 'Selling'}
                user={this.props.user}
                address={address}
                item={selected || {}}
              />
            </div>

            <div className="help">
              Don’t see your listing? Create it as a Hip Pocket.
            </div>

            <div className="hr" style={{ width: '100%' }}></div>

            <div className="list">

              {
                searching &&
                <i className="fa fa-spinner fa-spin fa-fw loader"></i>
              }

              <ListingsView
                params={params}
                listings={listings}
                onPlaceSelect={(item) => this.onPlaceSelect(item)}
              />

              <PlacesView
                places={places}
                onPlaceSelect={(item) => this.onPlaceSelect(item)}
              />
            </div>
          </div>
        }
      </div>
    )
  }
}
