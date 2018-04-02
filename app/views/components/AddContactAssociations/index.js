import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { selectContacts } from '../../../reducers/contacts/list'

import AddAssociation from '../AddAssociation'
import SelectContactModal from '../SelectContactModal'

import { normalizeContact } from '../../utils/association-normalizers'

const title = 'Add a contact'

function AddContactAssociation({ handleAdd, contactsList }) {
  return (
    <AddAssociation
      title={title}
      render={({ isOpen, handleClose }) => {
        const add = ({ contact }) => {
          handleAdd(normalizeContact(contact), handleClose)
        }

        return (
          <SelectContactModal
            title={title}
            isOpen={isOpen}
            handleSelectedItem={add}
            handleOnClose={handleClose}
            contactsList={contactsList}
          />
        )
      }}
    />
  )
}

AddContactAssociation.propTypes = {
  handleAdd: PropTypes.func.isRequired
}

function mapStateToProps(state) {
  const { contacts: { list } } = state

  return {
    contactsList: selectContacts(list)
  }
}

export default connect(mapStateToProps)(AddContactAssociation)
