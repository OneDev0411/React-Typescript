import React from 'react'
import { browserHistory } from 'react-router'
import { Grid, Row, Col, Button, FormControl, Modal } from 'react-bootstrap'
import _ from 'underscore'
import Deal from '../../../../../models/Deal'
import listings from '../../../../../utils/listing'
import Create from './create-modal'

export default class DealCreate extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      address: '',
      selected: null,
      places: {},
      searching: false
    }
  }

  componentDidMount() {
  }

  async onChangeAddress(e) {
    const address = e.target.value

    this.setState({
      address,
      selected: null
    })

    if (address.length === 0)
      return

    // show loading
    this.setState({ searching: true })

    // get data
    const places = await this.search(address)

    // hide loading
    this.setState({
      places,
      searching: false
    })
  }

  async search(address) {
    const type = this.props.params.type

    try {
      let response

      if (type === 'listing') {
        response = await Deal.searchPlaces(address)
        return this.createList(response.results)
      }

      if (type === 'offer') {
        response = await Deal.searchListings(address)
        return this.createList(response.data)
      }
    }
    catch(e) {
      console.warn(e)
      return
    }
  }

  createList(data) {
    const list = []
    const type = this.props.params.type

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
          full_address: listings.addressTitle(item.address),
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
    console.log(item)
    this.setState({
      selected: item,
      address: item.full_address
    })
  }

  render() {
    const { params } = this.props
    const { address, places, searching, selected } = this.state

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
                address={address}
                address_components={selected ? selected.address_components : null}
              />
            </div>
            <div className="help">Don’t see your listing? Create it as a Hip Pocket.</div>
            <div className="hr" style={{ width: '100%' }}></div>
            <div className="list">

              {
                params.type === 'listing' &&
                <span className="title">Places</span>
              }

              {
                searching &&
                <i className="fa fa-spinner fa-spin fa-fw loader"></i>
              }

              {
                params.type === 'listing' && _.map(places, (item, key) => (
                  <div
                    key={`PLACE_${key}`}
                    className="item"
                    onClick={this.onPlaceSelect.bind(this, item)}
                  >
                    { item.full_address }
                  </div>
                ))
              }

              {
                params.type === 'offer' && _.map(places, (item, key) => {
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
                        style={{ backgroundColor: listings.getStatusColorClass(item.status) }}
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
              }
            </div>
          </div>
        }
      </div>
    )
  }
}
