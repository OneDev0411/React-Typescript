import React from 'react'
import { Modal } from 'react-bootstrap'
import listingsHelper from '../../../../../../utils/listing'
import ListingsView from '../../components/listings-search'
import SearchInput from '../../components/rx-input'
import Deal from '../../../../../../models/Deal'

export default class extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      searching: false,
      listings: null,
      errorMessage: null
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
    this.setState({ searching: true, errorMessage: null })

    try {
      // search in mls listings
      const response = await Deal.searchListings(address)
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
        searching: false
      })
    } catch (err) {
      this.setState({
        searching: false,
        errorMessage: 'Sorry, something went wrong. Please try again.'
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
    const { searching, listings, errorMessage } = this.state

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

          {errorMessage && (
            <div
              className="c-alert c-alert--error"
              style={{
                margin: '1rem 2rem'
              }}
            >
              {errorMessage}
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
