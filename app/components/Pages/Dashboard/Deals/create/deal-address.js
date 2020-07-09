import React, { useState } from 'react'
import cn from 'classnames'
import styled from 'styled-components'
import Flex from 'styled-flex-component'

import { Button, useTheme } from '@material-ui/core'
import { mdiPlus } from '@mdi/js'

import { normalizeAddress } from 'models/Deal/helpers/normalize-address'
import { InlineAddressField } from 'components/inline-editable-fields/InlineAddressField'

import SearchListings from 'components/SearchListingDrawer'

import { H2 } from 'components/Typography/headings'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import RequiredIcon from 'components/SvgIcons/Required/IconRequired'

const AddressInput = styled.input`
  border: 1px dashed ${({ theme }) => theme.palette.secondary.main};
  border-radius: 3px;
  height: 35px;
  width: 20rem;
  margin: 0.5rem 0 0 0;
  padding: 0 5px;
`

export default function DealAddress(props) {
  const theme = useTheme()
  const [showManualAddress, setShowManualAddress] = useState(false)
  const [showMlsDrawer, setShowMlsDrawer] = useState(false)

  const isBuyingSide = props.dealSide === 'Buying'
  const listingImage =
    (props.dealAddress && props.dealAddress.image) ||
    '/static/images/deals/home.svg'

  const toggleMlsDrawer = () => setShowMlsDrawer(!showMlsDrawer)
  const toggleManualAddressEntry = () =>
    setShowManualAddress(!showManualAddress)

  const handleSubmitManualAddress = address =>
    onCreateAddress({
      address_components: normalizeAddress(address)
    })

  const handleSelectListing = listings =>
    onCreateAddress({
      id: listings[0].id,
      image: listings[0].cover_image_url,
      address_components: listings[0].property.address
    })

  const onCreateAddress = address => {
    setShowManualAddress(false)
    setShowMlsDrawer(false)

    props.onCreateAddress(address, 'address')
  }

  return (
    <div className="form-section deal-address">
      <H2 className={cn('hero', { hasError: props.hasError })}>
        What is the address of the subject property?&nbsp;
        {props.isRequired && <span className="required">*</span>}
        {props.hasError && <RequiredIcon />}
      </H2>

      {props.dealAddress ? (
        <div className="address-info">
          <img alt="" src={listingImage} />
          <span className="name">
            {props.dealAddress.address_components.street_number}
            &nbsp;
            {props.dealAddress.address_components.street_name}
            &nbsp;
            {props.dealAddress.address_components.street_suffix}
          </span>

          <span className="remove-address" onClick={props.onRemoveAddress}>
            Remove Address
          </span>
        </div>
      ) : (
        <div>
          {isBuyingSide && (
            <div className="entity-item address new">
              <Button
                color="secondary"
                className="add-item"
                onClick={toggleMlsDrawer}
              >
                <SvgIcon
                  path={mdiPlus}
                  rightMargined
                  color={theme.palette.secondary.main}
                />
                <span className="text">Enter MLS #</span>
              </Button>
            </div>
          )}

          {showManualAddress ? (
            <Flex alignCenter>
              <InlineAddressField
                address={props.address}
                handleCancel={props.toggleMode}
                handleSubmit={handleSubmitManualAddress}
                style={{
                  width: '20rem'
                }}
                renderSearchField={inputProps => (
                  <AddressInput
                    {...inputProps}
                    placeholder="Search address..."
                    type="text"
                    autoFocus
                  />
                )}
              />

              <Button
                color="secondary"
                style={{ margin: 0, padding: 0, marginLeft: '0.5rem' }}
                onClick={toggleManualAddressEntry}
              >
                Cancel
              </Button>
            </Flex>
          ) : (
            <div className="entity-item address new">
              <Button
                color="secondary"
                className="add-item"
                onClick={toggleManualAddressEntry}
              >
                <SvgIcon
                  path={mdiPlus}
                  rightMargined
                  color={theme.palette.secondary.main}
                />
                <span className="text">
                  {isBuyingSide ? 'Or manually input' : 'Add address'}
                </span>
              </Button>
            </div>
          )}
        </div>
      )}

      <SearchListings
        isOpen={showMlsDrawer}
        title="Address"
        searchPlaceholder="Enter MLS# or an address"
        allowedStatuses={['Pending', 'Leased', 'Active']}
        onSelectListingsCallback={handleSelectListing}
        onClose={toggleMlsDrawer}
      />
    </div>
  )
}
