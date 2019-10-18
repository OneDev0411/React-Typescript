import React from 'react'
import { render, fireEvent } from '@testing-library/react'

import { updateEmailCampaign } from 'models/email/update-email-campaign'

import { TestBed } from '../../../../tests/unit/TestBed'
import { BulkEmailComposeForm } from './BulkEmailComposeForm'

jest.mock('models/email/update-email-campaign')

describe('BulkEmailComposeForm', () => {
  /**
   * // https://gitlab.com/rechat/web/issues/3389
   * due_date should not be null when schedule is removed. null due_date means
   * draft.
   */
  test("Removing schedule doesn't save the email as draft", () => {
    const emailId = '123'

    const { getByTestId } = render(
      <TestBed>
        <BulkEmailComposeForm
          emailId={emailId}
          initialValues={{
            to: [
              {
                recipient_type: 'Email',
                email: 'alireza.mirian@gmail.com'
              }
            ],
            subject: 'test',
            body: 'test body',
            due_at: new Date()
          }}
        />
      </TestBed>
    )

    fireEvent.click(getByTestId('compose-schedule-email'))
    fireEvent.click(getByTestId('date-picker-remove'))
    fireEvent.click(getByTestId('compose-send-email'))

    expect(updateEmailCampaign).toBeCalledWith(
      emailId,
      expect.objectContaining({
        // It would be better if we could check the date is before current time
        // Don't know if it's possible with jest.
        due_at: expect.any(Date)
      } as IEmailCampaignInput)
    )
  })
})
