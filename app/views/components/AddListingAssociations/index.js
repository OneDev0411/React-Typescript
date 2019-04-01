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
            <Tooltip id={`tooltip_${title}`} caption={title}>
              {this.props.buttonRenderer(handleOpen)}
            </Tooltip>
            {isActive && (
              <SearchListingsDrawer
                isOpen={isActive}
                title={title}
                onClose={handleClose}
                onSelectListings={listings =>
                  this.onSelectHandler(listings[0], handleClose)
                }
              />
            )}
          </div>
        )}
      />
    )
  }
}
