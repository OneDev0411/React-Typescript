import React from 'react'
import { fireEvent } from '@testing-library/react'

import {AppTheme} from '../../../../../../AppTheme'

import { Addresses } from '.'
import attributeDefs from 'fixtures/contacts/attribute-defs'
import contact from 'fixtures/contacts/full-contact'
import { normalizeContact } from 'models/contacts/helpers/normalize-contact'
import renderWithConfirmationModal from 'utils/test-utils/render-with-confirmation-modal'
import { TestBed } from '../../../../../../../tests/unit/TestBed'

// mocks
jest.mock('models/contacts/delete-attributes-bulk-contacts')
jest.mock('utils/load-js')

describe('Addresses tests', function() {
  it('should go to edit mode and functionality work properly when user clicks on an address', function() {
    const {
      getByTestId,
      getAllByText,
      queryByTestId
    } = renderWithConfirmationModal(
      <TestBed>
        <AppTheme>
          <Addresses
            attributeDefs={attributeDefs}
            contact={normalizeContact(contact)}
          />
        </AppTheme>
      </TestBed>
    )

    const editButtons = getAllByText('Edit')
    const buttonsCount = editButtons.length
    const button = editButtons[0]
    fireEvent.click(button)
    const inlineEditContainer = queryByTestId('inline-editable-field-container')
    const deleteButton = getByTestId('inline-editable-field-delete')
    fireEvent.click(deleteButton)
    const confirmButton = getByTestId('confirmation-modal-confirm-button')
    fireEvent.click(confirmButton)

    // it should render edit actions
    expect(inlineEditContainer).not.toBeNull()
    // it should delete the item from list
    expect(buttonsCount).toBe(getAllByText('Edit').length + 1)
  })
})
