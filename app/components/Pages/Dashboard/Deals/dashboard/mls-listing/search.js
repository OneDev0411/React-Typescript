import React from 'react'
import { Modal } from 'react-bootstrap'
import listingsHelper from '../../../../../../utils/listing'
import ListingsView from '../../components/listings-search'
import SearchInput from '../../components/rx-input'
import Deal from '../../../../../../models/Deal'
import Alert from '../../../Partials/Alert'
import listing from '../../../../../../utils/listing'

const WARNING_MESSAGE = `
  Try entering the address like this ‘1234 Main Street, 
  Dallas Texas, 75243’ to get the best results.`

export default class extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      searching: false,
      listings: null,
      failure: null
    }
  }

  async search(address) {
    if (address.length === 0) {
      return false
    }

    if (address.length < 3) {
      this.setState({
        listings: null,
        failure:
          listing.length > 0
            ? null
            : {
              type: 'warning',
              message: `Your input is too short! ${WARNING_MESSAGE}`
            }
      })

      return false
    }

    // show loading
    this.setState({ listings: null, searching: true, failure: null })

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
      if (listings.length > 0) {
        this.setState({
          listings,
          searching: false
        })
      } else {
        this.setState({
          listings: null,
          searching: false,
          failure:
            listing.length > 0
              ? null
              : {
                type: 'warning',
                message: `We were unable to locate the address. ${WARNING_MESSAGE}`
              }
        })
      }
    } catch (err) {
      this.setState({
        searching: false,
        failure: {
          code: 500,
          type: 'error'
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
    const { searching, listings, failure } = this.state

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

          {failure && <Alert {...failure} supportHandler={onHide} />}

          <div className="listings">
            {searching && (
              <span>
                <span>Loading...</span>
                <i className="fa fa-spinner fa-spin fa-fw loader" />
              </span>
            )}
            <div className="list">
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
