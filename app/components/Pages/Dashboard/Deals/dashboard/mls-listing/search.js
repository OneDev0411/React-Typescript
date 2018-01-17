import React from 'react'
import { Modal } from 'react-bootstrap'
import listingsHelper from '../../../../../../utils/listing'
import ListingsView from '../../components/listings-search'
import SearchInput from '../../components/rx-input'
import Deal from '../../../../../../models/Deal'
import listing from '../../../../../../utils/listing'

export default class extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      searching: false,
      listings: null,
      alert: null
    }
  }

  /**
   * search rechat listings
   */
  async search(address) {
    if (address.length === 0) {
      return false
    }

    // show loading
    this.setState({ searching: true, alert: null })
    console.log('salam')

    try {
      // search in mls listings
      const response = await Deal.searchListings(address)

      console.log(response.data)

      const listings = response.data.map(item => ({
        id: item.id,
        full_address: listingsHelper.addressTitle(item.address),
        address_components: item.address,
        price: item.price,
        status: item.status,
        image: item.cover_image_url
      }))

      // hide loading
      this.setState({
        listings,
        searching: false,
        alert:
          listing.length > 0
            ? null
            : {
              type: 'warning',
              message:
                  'We were unable to locate the address. Try entering the address like this ‘1234 Main Street, Dallas Texas, 75243’ to get the best results.'
            }
      })
    } catch (err) {
      console.log(err)
      this.setState({
        searching: false,
        alert: {
          type: 'error',
          message:
            'You have encountered an unknown system issue. We\'re working on it. In the meantime, connect with our Support team.'
        }
      })
    }
  }

  onSelectListing(item) {
    this.setState(
      {
        listings: null
      },
      () => {
        this.props.onSelectListing(item)
      }
    )
  }

  render() {
    const { show, modalTitle, onHide } = this.props
    const { searching, listings, alert } = this.state

    return (
      <Modal
        show={show}
        dialogClassName="deal-mls-search"
        backdrop="static"
        onHide={onHide}
      >
        <Modal.Header closeButton>{modalTitle || 'Add MLS #'}</Modal.Header>

        <Modal.Body>
          <SearchInput
            placeholder="Enter MLS # or address"
            onChange={() => null}
            subscribe={value => this.search(value)}
          />

          {alert && (
            <div
              className={`c-alert c-alert--${alert.type}`}
              style={{
                margin: '1rem 2rem'
              }}
            >
              {alert.message}
            </div>
          )}

          <div className="listings">
            <div className="list">
              {searching && <i className="fa fa-spinner fa-spin fa-fw loader" />}

              <ListingsView
                type={null}
                listings={listings}
                onSelectListing={item => this.onSelectListing(item)}
              />
            </div>
          </div>
        </Modal.Body>
      </Modal>
    )
  }
}
