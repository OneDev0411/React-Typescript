import React from 'react'
import { fireEvent, render } from '@testing-library/react'

import { createEmailCampaign as mockCreateEmailCampaign } from 'models/email/create-email-campaign'
import { updateEmailCampaign as mockUpdateEmailCampaign } from 'models/email/update-email-campaign'

// eslint-disable-next-line import/no-unresolved
import user from 'fixtures/users/agent.json'

// eslint-disable-next-line import/no-unresolved
import templateInstance from 'fixtures/marketing-center/template-instance.json'

import { TestBed } from '../../../../tests/unit/TestBed'
import { BulkEmailComposeForm } from './BulkEmailComposeForm'

jest.mock('models/email/create-email-campaign')
jest.mock('models/email/update-email-campaign')
jest.mock('models/contacts/search-contacts')
jest.mock('models/contacts/get-contacts-tags')
jest.mock('models/filter-segments/get-segments')

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

    // TODO: replacing it with waitFor https://testing-library.com/docs/dom-testing-library/api-async#waitfor
    setTimeout(() => {
      expect(mockUpdateEmailCampaign).toBeCalledWith(
        emailId,
        expect.objectContaining({
          // It would be better if we could check the date is before current time
          // Don't know if it's possible with jest.
          due_at: expect.any(Date)
        } as IEmailCampaignInput)
      )
    }, 2000)
  })

  // test('It passes template id when sending email', () => {
  //   const { getByTestId } = render(
  //     <TestBed>
  //       <BulkEmailComposeForm
  //         hasStaticBody
  //         initialValues={{
  //           from: user as any,
  //           body: templateInstance.html
  //         }}
  //       />
  //     </TestBed>
  //   )

  //   const recipientsInput = getByTestId('email-recipients-input')
  //   const subjectInput = getByTestId('email-subject')
  //   const subject = 'Testing bulk emails'
  //   const email = 'snhasani@gmail.com'

  //   // Add a recipient
  //   fireEvent.change(recipientsInput, {
  //     target: { value: email }
  //   })
  //   fireEvent.keyDown(recipientsInput, {
  //     key: 'Enter',
  //     code: 13,
  //     charCode: 13
  //   })

  //   // Set subject
  //   fireEvent.change(subjectInput, {
  //     target: { value: subject }
  //   })

  //   // Send email
  //   fireEvent.click(getByTestId('compose-send-email'))

  //   // TODO: replacing it with waitFor https://testing-library.com/docs/dom-testing-library/api-async#waitfor
  //   setTimeout(() => {
  //     expect(mockCreateEmailCampaign).toHaveBeenCalledWith(
  //       expect.objectContaining({
  //         from: user.id,
  //         html: templateInstance.html,
  //         template: templateInstance.id,
  //         to: [
  //           {
  //             recipient_type: 'Email',
  //             email
  //           }
  //         ]
  //       }),
  //       expect.anything()
  //     )
  //   }, 2000)
  // })
})
