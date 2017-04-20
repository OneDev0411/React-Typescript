import React from 'react'
import { browserHistory } from 'react-router'
import { Grid, Row, Col, Button, FormControl, Modal } from 'react-bootstrap'
import debounce from 'debounce'
import _ from 'underscore'
import Deal from '../../../../../models/Deal'
import listingsHelper from '../../../../../utils/listing'
import Create from './create-modal'

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
    this.search = debounce(this.search, 1500)
  }

  onChangeAddress(e) {
    const address = e.target.value

    this.setState({
      address,
      selected: null
    })

    if (address.length === 0)
      return

    this.search(address)
  }

  async search(address) {
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
          onChange={this.onChangeAddress.bind(this)}
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

              <Create
                type={params.type}
                side={params.type === 'offer' ? 'Buying' : 'Selling'}
                user={this.props.user}
                address={address}
                item={selected || {}}
              />
            </div>
            <div className="help">Don’t see your listing? Create it as a Hip Pocket.</div>
            <div className="hr" style={{ width: '100%' }}></div>
            <div className="list">

              {
                searching &&
                <i className="fa fa-spinner fa-spin fa-fw loader"></i>
              }

              {
                params.type === 'offer' &&
                _.chain(listings)
                .filter(item => {
                  return item.status.startsWith('Active') || item.status === 'Pending'
                })
                .map((item, key) => {
                  const c = item.address_components
                  return (
                    <div
                      key={`PLACE_${key}`}
                      className="item listing"
                      onClick={this.onPlaceSelect.bind(this, item)}
                    >
                      <img
                        src={item.image || '/static/images/deals/home.svg'}
                        className="listing-image"
                      />
                      <span
                        className="status"
                        style={{ backgroundColor: listingsHelper.getStatusColorClass(item.status) }}
                      >
                        { item.status }
                      </span>
                      <div style={{ color: '#5b6469' }}>
                        {c.street_number} {c.street_name} {c.street_suffix}
                      </div>
                      <div style={{ color: '#a0a0a0' }}>
                        { c.city }, {c.state}, {c.postal_code}, ${item.price}
                      </div>
                    </div>
                  )
                })
                .value()
              }

              {
                _.size(places) > 0 &&
                <div>
                  <span className="title">Places</span>
                  <img
                    src="/static/images/deals/google.png"
                    style={{ height: '20px', float: 'right' }}
                  />
                </div>
              }

              {
                _.map(places, (item, key) => (
                  <div
                    key={`PLACE_${key}`}
                    className="item"
                    onClick={this.onPlaceSelect.bind(this, item)}
                  >
                    { item.full_address }
                  </div>
                ))
              }
            </div>
          </div>
        }
      </div>
    )
  }
}
