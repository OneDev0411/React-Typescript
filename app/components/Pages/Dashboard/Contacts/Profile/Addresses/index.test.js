import React from 'react'
import { cleanup, fireEvent } from '@testing-library/react'

import { Addresses } from './index'
import attributeDefs from 'fixtures/contacts/attribute-defs'
import contact from 'fixtures/contacts/full-contact'
import { normalizeContact } from 'models/contacts/helpers/normalize-contact'
import renderWithConfirmationModal from 'utils/test-utils/render-with-confirmation-modal'

// mocks
jest.mock('models/contacts/delete-attributes-bulk-contacts', function() {
  return {
    deleteAttributesFromContacts() {
      return jest.fn(() => Promise.resolve())
    }
  }
})

jest.mock('utils/load-js', function() {
  return {
    loadJS() {
      return jest.fn(() => Promise.resolve())
    }
  }
})

//
afterEach(cleanup)
describe('Addresses tests', function() {
  it('should go to edit mode and functionality work properly when user clicks on an address', function() {
    const {
      getByTestId,
      getAllByText,
      queryByTestId
    } = renderWithConfirmationModal(
      <Addresses
        attributeDefs={attributeDefs}
        contact={normalizeContact(contact)}
      />
    )

    const editButtons = getAllByText('Edit')
    const buttonsCount = editButtons.length
    const button = editButtons[0]
    fireEvent.click(button)
    const inlineEditContainer = queryByTestId('inline-editable-field-container')
    const deleteButton = getByTestId('inline-editable-field-delete')
    const saveButton = getByTestId('inline-editable-field-save')
    fireEvent.click(deleteButton)
    const confirmButton = getByTestId('confirmation-modal-confirm-button')
    fireEvent.click(confirmButton)

    // it should render edit actions
    expect(inlineEditContainer).not.toBeNull()
    // it should delete the item from list
    expect(buttonsCount).toBe(getAllByText('Edit').length + 1)
  })
})
