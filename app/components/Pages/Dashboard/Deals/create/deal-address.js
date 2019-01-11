import React from 'react'
import cn from 'classnames'

import { H2 } from 'components/Typography/headings'

import ActionButton from 'components/Button/ActionButton'

import SearchListings from 'components/SearchListingDrawer'

import Address from '../components/Address'

import RequiredIcon from '../../../../../views/components/SvgIcons/Required/IconRequired'

const BUYING = 'Buying'

export default class DealAddress extends React.Component {
  state = {
    showManualAddress: false,
    showMlsSearch: false
  }

  toggleManualAddressModal() {
    this.setState(state => ({
      showManualAddress: !state.showManualAddress
    }))
  }

  toggleMlsModal = () => {
    this.setState(state => ({
      showMlsSearch: !state.showMlsSearch
    }))
  }

  onCreateAddress = address => {
    this.setState({
      showManualAddress: false,
      showMlsSearch: false
    })

    this.props.onCreateAddress(address, 'address')
  }

  handleSelectListing = listings => {
    this.onCreateAddress({
      id: listings[0].id,
      image: listings[0].cover_image_url,
      address_components: listings[0].property.address
    })
  }

  getListingImage = address => address.image || '/static/images/deals/home.svg'

  render() {
    const {
      isRequired,
      hasError,
      defaultDealAddress,
      dealAddress,
      dealSide,
      onRemoveAddress
    } = this.props

    // don't show address component when deal is created (web#1610)
    if (defaultDealAddress) {
      return false
    }

    return (
      <div className="form-section deal-address">
        <H2 className={cn('hero', { hasError })}>
          What is the address of the subject property?&nbsp;
          {isRequired && <span className="required">*</span>}
          {hasError && <RequiredIcon />}
        </H2>

        <SearchListings
          isOpen={this.state.showMlsSearch}
          title="Address"
          searchPlaceholder="Enter MLS# or an address"
          onSelectListings={this.handleSelectListing}
        />

        <Address
          show={this.state.showManualAddress}
          onClose={this.toggleManualAddressModal}
          onCreateAddress={this.onCreateAddress}
        />

        {dealAddress ? (
          <div className="address-info">
            <img
              alt="listing not available"
              src={this.getListingImage(dealAddress)}
            />
            <span className="name">
              {dealAddress.address_components.street_number}
              &nbsp;
              {dealAddress.address_components.street_name}
              &nbsp;
              {dealAddress.address_components.street_suffix}
            </span>

            <span className="remove-address" onClick={onRemoveAddress}>
              Remove Address
            </span>
          </div>
        ) : (
          <div>
            {dealSide === BUYING && (
              <div
                className="entity-item address new"
                onClick={() => this.toggleMlsModal()}
              >
                <ActionButton appearance="link" className="add-item">
                  <span className="icon">+</span>
                  <span className="text">Enter MLS #</span>
                </ActionButton>
              </div>
            )}

            <div
              className="entity-item address new"
              onClick={() => this.toggleManualAddressModal()}
            >
              <ActionButton appearance="link" className="add-item">
                <span className="icon">+</span>
                <span className="text">
                  {dealSide === BUYING ? 'Or manually input' : 'Add address'}
                </span>
              </ActionButton>
            </div>
          </div>
        )}
      </div>
    )
  }
}
