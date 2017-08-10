import React from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import {
  Grid,
  Row,
  Col,
  Button,
  Modal
} from 'react-bootstrap'
import _ from 'underscore'
import Deal from '../../../../../models/Deal'
import listingsHelper from '../../../../../utils/listing'
import AddressComponents from './address_components'
import PlacesView from './places_view'
import ListingsView from './listings_view'
import DealButton from './button'
import SearchInput from './search_input'
import { createDeal } from '../../../../../store_actions/deals'

class DealCreate extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      showModal: false,
      saving: false,
      showAddressComponents: false,
      option: null,
      address: '',
      selected: null,
      listings: {},
      places: {},
      searching: false
    }
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

    const { type } = this.props
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
        places
      })
    }
    catch(e) {}

    this.setState({ searching: false })
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
      address: item.full_address,
      showAddressComponents: !item.isListing,
      showModal: item.isListing
    })

    if (item.isListing) {
      const side = this.props.type === 'offer' ? 'Buying' : 'Selling'
      const data = {
        context: {
          deal_type: side
        },
        listing: item.id
      }

      return this.save(data)
    }
  }

  /**
   * prepare listing address components to save
   */
  createNewListing(address_components) {
    const { type } = this.props
    const { street_number, street_address, unit_number, city, state, zipcode } = address_components

    const side = this.props.type === 'offer' ? 'Buying' : 'Selling'

    // create full address
    let full_address = [
      street_number,
      street_address,
      city,
      state,
      zipcode
    ].join(' ').trim()

    const data = {
      context: {
      deal_type:
        side,
        full_address,
        street_number,
        street_address,
        unit_number,
        city,
        state,
        zipcode
      }
    }

    this.save(data)
  }

  /**
   * save deal
   */
  async save(data) {
    const { createDeal } = this.props

    // show loading
    this.setState({ saving: true })

    // create deal
    const deal = await createDeal(data)

    // hide loading
    this.setState({ saving: false })

    // navigate to the deal
    browserHistory.push(`/dashboard/deal/${deal.id}`)
  }

  /**
   * open listing/offer wizard
   */
  onClickOption(type, item) {
    this.setState({
      showModal: true
    })
  }

  render() {
    const { type, user } = this.props
    const {
      showModal,
      saving,
      address,
      listings,
      places,
      searching,
      selected,
      showAddressComponents
    } = this.state

    return (
      <div className="deal-create">
        <DealButton
          onClickOption={(type, item) => this.onClickOption(type, item)}
          type={type}
        />

        <AddressComponents
          onClickSave={(address_components) => this.createNewListing(address_components)}
          onHide={() => this.setState({ showAddressComponents: false, showModal: true })}
          saving={saving}
          show={showAddressComponents}
          address={address}
          item={selected || {}}
        />

        <Modal
          show={showModal}
          dialogClassName="modal-create-deal"
          onHide={() => this.setState({ showModal: false })}
        >

          <Modal.Header closeButton>
            <Modal.Title>
              Type the address of the listing
            </Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <SearchInput
              value={address}
              onChange={e => this.onChangeAddress(e)}
              subscribe={value => this.search(value)}
            />

            <Button
              className="btn-create"
              bsStyle="primary"
              onClick={() => this.showCreateModal()}
              disabled={saving}
            >
              { saving ? 'Creating...' : 'Create' }
            </Button>

            {
              address.length > 0 &&
              <div className="places">

                <div className="list">

                  {
                    searching &&
                    <i className="fa fa-spinner fa-spin fa-fw loader"></i>
                  }

                  <ListingsView
                    type={type}
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
          </Modal.Body>
        </Modal>

      </div>
    )
  }
}

export default connect(({data}) => ({
  user: data.user
}), { createDeal })(DealCreate)
