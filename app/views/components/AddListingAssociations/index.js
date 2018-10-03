import React from 'react'
import PropTypes from 'prop-types'

import Tooltip from '../tooltip'
import { AddAssociation } from '../AddAssociation'
import SearchListingsDrawer from '../SearchListingDrawer'
import { normalizeListing } from '../../utils/association-normalizers'

export class AddListingAssociation extends React.Component {
  static propTypes = {
    title: PropTypes.string,
    handleAdd: PropTypes.func.isRequired,
    buttonRenderer: PropTypes.func.isRequired
  }

  static defaultProps = {
    title: 'Attach Listing'
  }

  onSelectHandler = (contact, closeHandler) =>
    this.props.handleAdd(normalizeListing(contact), closeHandler)

  render() {
    const { title } = this.props

    return (
      <AddAssociation
        render={({ isActive, handleClose, handleOpen }) => (
          <div>
            <Tooltip placement="bottom" caption={title}>
              {this.props.buttonRenderer(handleOpen)}
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
