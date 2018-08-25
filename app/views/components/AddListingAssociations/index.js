import React from 'react'
import PropTypes from 'prop-types'

import AddAssociation from '../AddAssociation'
// eslint-disable-next-line
import SearchListingsModal from '../SearchListing'

import { normalizeListing } from '../../utils/association-normalizers'

const title = 'Add a MLS listing'

function AddListingAssociation({ handleAdd }) {
  return (
    <AddAssociation
      title={title}
      render={({ isOpen, handleClose }) => {
        const add = listing => {
          handleAdd(normalizeListing(listing), handleClose)
        }

        return (
          <SearchListingsModal
            show={isOpen}
            modalTitle={title}
            onHide={handleClose}
            onSelectListing={add}
          />
        )
      }}
    />
  )
}

AddListingAssociation.propTypes = {
  handleAdd: PropTypes.func.isRequired
}

export default AddListingAssociation
