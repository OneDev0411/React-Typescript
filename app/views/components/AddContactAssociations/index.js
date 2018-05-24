import React from 'react'
import PropTypes from 'prop-types'

import AddAssociation from '../AddAssociation'
import SelectContactModal from '../SelectContactModal'

import { normalizeContact } from '../../utils/association-normalizers'

const title = 'Add a contact'

function AddContactAssociation({ handleAdd }) {
  return (
    <AddAssociation
      title={title}
      render={({ isOpen, handleClose }) => {
        const add = contact => {
          handleAdd(normalizeContact(contact), handleClose)
        }

        return (
          <SelectContactModal
            title={title}
            isOpen={isOpen}
            handleSelectedItem={add}
            handleOnClose={handleClose}
          />
        )
      }}
    />
  )
}

AddContactAssociation.propTypes = {
  handleAdd: PropTypes.func.isRequired
}

export default AddContactAssociation
