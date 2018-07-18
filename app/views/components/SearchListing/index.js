import React from 'react'
import Modal from '../BasicModal'

import listingsHelper from '../../../utils/listing'
import ListingsView from './ListView'
import SearchInput from '../Grid/Search'
import Deal from '../../../models/Deal'

import { Alert, ListingsContainer, Loading } from './styled'

export default class ListingSearch extends React.Component {
  state = {
    isSearching: false,
    listings: null,
    failure: null
  }

  warningMessage = `
  Try entering the address like this ‘1234 Main Street, 
  Dallas Texas, 75243’ to get the best results.`

  search = async address => {
    if (address.length === 0) {
      this.setState({
        listings: null,
        failure: null
      })

      return false
    }

    if (address.length < 3) {
      this.setState({
        listings: null,
        failure: {
          type: 'warning',
          message: `Your input is too short! ${this.warningMessage}`
        }
      })

      return false
    }

    // show loading
    this.setState({ listings: null, isSearching: true, failure: null })

    try {
      // search in mls listings
      const response = await Deal.searchListings(address)

      const listings = response.map(item => ({
        id: item.id,
        full_address: listingsHelper.addressTitle(item.address),
        address_components: item.address,
        price: item.price,
        status: item.status,
        image: item.cover_image_url,
        is_mls_search: item.is_mls_search || false
      }))

      // hide loading
      if (listings.length > 0) {
        this.setState({
          listings,
          isSearching: false
        })
      } else {
        this.setState({
          listings: null,
          isSearching: false,
          failure: {
            type: 'warning',
            message: `We were unable to locate the address. ${
              this.warningMessage
            }`
          }
        })
      }
    } catch (err) {
      this.setState({
        isSearching: false,
        failure: {
          type: 'error',
          message: err.response ? err.response.body.message : err.message
        }
      })
    }
  }

  onSelectListing = item =>
    this.setState(
      {
        listings: null
      },
      () => {
        this.props.onSelectListing(item)
      }
    )

  render() {
    const { modalTitle, onHide } = this.props
    const { isSearching, listings, failure } = this.state

    return (
      <Modal
        isOpen={this.props.show}
        handleOnClose={onHide}
        style={{
          content: {
            height: '548px',
            overflow: 'hidden'
          }
        }}
      >
        <Modal.Header
          title={modalTitle || 'Add MLS #'}
          showClose
          handleOnClose={onHide}
        />

        <Modal.Body style={{ height: '500px', padding: '0' }}>
          <SearchInput
            placeholder="Enter MLS # or address"
            debounceTime={500}
            isSearching={isSearching}
            onChange={this.search}
            style={{
              margin: '15px'
            }}
          />

          {failure && <Alert>{failure.message}</Alert>}

          <ListingsContainer isSearching={isSearching}>
            {isSearching && (
              <Loading>
                <i className="fa fa-spinner fa-spin fa-fw loader" />
                Searching Listings ...
              </Loading>
            )}

            <ListingsView
              listings={listings}
              onSelectListing={item => this.onSelectListing(item)}
            />
          </ListingsContainer>
        </Modal.Body>
      </Modal>
    )
  }
}
