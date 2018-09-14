import React from 'react'
import PropTypes from 'prop-types'

import Tooltip from '../tooltip'
import Button from '../Button/IconButton'
import { AddAssociation } from '../AddAssociation'
import SearchListingsDrawer from '../SearchListingDrawer'
import Icon from '../SvgIcons/Properties/IconProperties'
import { normalizeListing } from '../../utils/association-normalizers'

export class AddListingAssociation extends React.Component {
  static propTypes = {
    handleAdd: PropTypes.func.isRequired
  }

  onSelectHandler = (contact, closeHandler) =>
    this.props.handleAdd(normalizeListing(contact), closeHandler)

  render() {
    const title = 'Attach Listing'

    return (
      <AddAssociation
        render={({ isActive, handleClose, handleOpen }) => (
          <div>
            <Tooltip placement="bottom" caption={title}>
              <Button
                isFit
                inverse
                type="button"
                iconSize="large"
                onClick={handleOpen}
              >
                <Icon />
              </Button>
            </Tooltip>
            <SearchListingsDrawer
              isOpen={isActive}
              compact={false}
              title={title}
              onClose={handleClose}
              onSelectListing={listing =>
                this.onSelectHandler(listing, handleClose)
              }
            />
          </div>
        )}
      />
    )
  }
}
