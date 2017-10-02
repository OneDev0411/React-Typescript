import React from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { addNotification as notify } from 'reapop'
import { Grid, Row, Col, Button, Modal } from 'react-bootstrap'
import _ from 'underscore'
import Deal from '../../../../../models/Deal'
import listingsHelper from '../../../../../utils/listing'
import AddressComponents from './address_components'
import ListingsView from '../components/listings-search'
import DealButton from './button'
import SearchInput from '../components/rx-input'
import { createDeal } from '../../../../../store_actions/deals'

class DealCreate extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      showModal: false,
      saving: false,
      showAddressComponents: false,
      address: '',
      listings: {},
      searching: false,
      property_type: null
    }
  }

  /**
   * triggers when user types address
   */
  onChangeAddress(e) {
    const address = e.target.value

    this.setState({
      address
    })
  }

  /**
   * search rechat listings
   */
  async search(address) {
    if (address.length === 0) {
      return false
    }

    // show loading
    this.setState({
      searching: true,
      listings: {}
    })

    try {
      // search in mls listings
      const response = await Deal.searchListings(address)
      const listings = this.createList(response.data)

      // hide loading
      this.setState({
        listings,
        searching: false
      })
    }
    catch(e) {
      this.setState({ searching: false })
    }
  }

  /**
   * normalize list
   */
  createList(data) {
    const list = []

     _.each(data, item => {
      list.push({
        id: item.id,
        full_address: listingsHelper.addressTitle(item.address),
        address_components: item.address,
        price: item.price,
        status: item.status,
        image: item.cover_image_url
      })
    })

    return list
  }

  /**
   * on user selects a place or listing
   */
  onSelectListing(item) {
    this.setState({
      address: item.full_address
    })

    const side = this.props.type === 'offer' ? 'Buying' : 'Selling'
    const { property_type } = this.state

    const data = {
      property_type,
      deal_type: side,
      listing: item.id
    }

    return this.save(data)
  }

  /**
   * prepare listing address components to save
   */
  createNewListing(address_components) {
    const { type } = this.props
    const { street_number, street_name, unit_number, city, state, postal_code } = address_components
    const { property_type } = this.state

    const side = (type === 'offer') ? 'Buying' : 'Selling'

    // create full address
    let full_address = [
      street_number,
      street_name,
      city,
      state,
      postal_code
    ].join(' ').trim()

    const data = {
      property_type,
      deal_type: side,
      deal_context: {
        full_address,
        street_number,
        unit_number,
        city,
        state,
        street_name,
        postal_code
      }
    }

    this.save(data)
  }

  /**
   * save deal
   */
  async save(data) {
    const { user, createDeal, notify } = this.props

    // show loading
    this.setState({ saving: true })

    try {
      // create deal
      const deal = await Deal.create(user, data)

      // dispatch new deal
      await createDeal(deal)

      // navigate to the deal
      browserHistory.push(`/dashboard/deals/${deal.id}`)
    } catch(e) {
      this.setState({ saving: false })

      // notify user
      notify({
        title: 'Can not create deal',
        message: e.response && e.response.body ? e.response.body.message : null,
        status: 'error',
        dismissible: true
      })
    }
  }

  /**
   * open listing/offer wizard
   */
  onClickOption(type, property_type) {
    const showAddressComponents = (type === 'listing')
    const showModal = (type !== 'listing')

    this.setState({
      property_type,
      showAddressComponents,
      showModal
    })
  }

  render() {
    const { type, user } = this.props
    const {
      showModal,
      saving,
      address,
      listings,
      searching,
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
          onHide={() => this.setState({ showAddressComponents: false })}
          saving={saving}
          show={showAddressComponents}
          address={address}
        />

        <Modal
          show={showModal}
          dialogClassName="modal-create-deal"
          onHide={() => this.setState({ showModal: false })}
        >

          <Modal.Header closeButton>
            Search by MLS# or address
          </Modal.Header>

          <Modal.Body>
            <SearchInput
              value={address}
              placeholder="Enter MLS # or address"
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

            <div className="listings">

              <div className="list">
                <div className="create-manually">
                  <span
                    onClick={() => this.setState({
                      showAddressComponents: true,
                      showModal: false
                    })}
                  >
                    Not on MLS?  Create manually.
                  </span>
                </div>
                {
                  searching &&
                  <i className="fa fa-spinner fa-spin fa-fw loader"></i>
                }

                <ListingsView
                  type={type}
                  listings={listings}
                  onSelectListing={(item) => this.onSelectListing(item)}
                />
              </div>
            </div>

          </Modal.Body>
        </Modal>

      </div>
    )
  }
}

export default connect(({data}) => ({
  user: data.user
}), { createDeal, notify })(DealCreate)
