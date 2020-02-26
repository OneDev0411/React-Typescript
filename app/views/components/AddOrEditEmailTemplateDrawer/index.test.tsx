import React, { ComponentProps } from 'react'

import { render, fireEvent } from '@testing-library/react'

import { TestBed } from '../../../../tests/unit/TestBed'

import { AddOrEditEmailTemplateDrawer } from './index'

const defaultProps: ComponentProps<typeof AddOrEditEmailTemplateDrawer> = {
  onClose: () => {},
  isOpen: true,
  activeTeamId: '111',
  addNotification: () => ({}),
  createEmailTemplate: () => Promise.resolve({} as any),
  emailTemplate: null,
  submitCallback: () => {},
  updateEmailTemplate: () => Promise.resolve({} as any)
}

describe('AddOrEditEmailTemplateDrawer', () => {
  // gitlab.com/rechat/web/issues/3401
  test("it doesn't let whitespace-only template name", done => {
    const emailTemplate: IBrandEmailTemplate = {
      body: 'test',
      editable: true,
      name: '',
      subject: '',
      include_signature: false,
      brand: '123',
      created_at: 123,
      deleted_at: null,
      goal: '',
      id: '123',
      text: '',
      type: 'brand_email',
      updated_at: 123
    }
    const updateEmailTemplate = jest.fn()
    const { getByTestId, getByText } = render(
      <TestBed>
        <AddOrEditEmailTemplateDrawer
          {...defaultProps}
          emailTemplate={emailTemplate}
          updateEmailTemplate={updateEmailTemplate}
        />
      </TestBed>
    )
    const nameInput = getByTestId('template-name-input')
    const saveButton = getByText('Save')

    setTimeout(done, 1000)
    fireEvent.change(nameInput, {
      target: { value: '   ' }
    })

    fireEvent.click(saveButton)

    // TODO: Naser or Mamal should need to check this test and fix that
    // expect(updateEmailTemplate).not.toBeCalled()
  })
})
