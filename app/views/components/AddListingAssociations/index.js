import React from 'react'
import PropTypes from 'prop-types'

import Tooltip from '../tooltip'
import Button from '../Button/IconButton'
import { AddAssociation } from '../AddAssociation'
import SearchListingsModal from '../SearchListing'
import Icon from '../SvgIcons/Properties/IconProperties'
import { normalizeListing } from '../../utils/association-normalizers'

export class AddListingAssociation extends React.Component {
  static propTypes = {
    handleAdd: PropTypes.func.isRequired
  }

  add = (contact, callback) =>
    this.props.handleAdd(normalizeListing(contact), callback)

  render() {
    const title = 'Attach Listing'

    return (
      <AddAssociation
        render={({ isActive, handleClose, handleOpen }) => (
          <div>
            <Tooltip placement="bottom" caption={title}>
              <Button isFit iconSize="large" inverse onClick={handleOpen}>
                <Icon />
              </Button>
            </Tooltip>
            <SearchListingsModal
              show={isActive}
              modalTitle={title}
              onHide={handleClose}
              onSelectListing={listing => this.add(listing, handleClose)}
            />
          </div>
        )}
      />
    )
  }
}
