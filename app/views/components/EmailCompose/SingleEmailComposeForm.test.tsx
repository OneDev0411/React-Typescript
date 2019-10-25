import React from 'react'
import { fireEvent, render } from '@testing-library/react'
import { keyBy } from 'lodash'

import roleObj from 'fixtures/deal/roles/18284e38-6732-11e9-91b6-0a95998482ac.json'
import checklistsArray from 'fixtures/deal/checklists.json'
import dealObj from 'fixtures/deal/164ca424-6732-11e9-82bf-0a95998482ac.json'
import tasksArray from 'fixtures/deal/tasks.json'
import { createEmailCampaign } from 'models/email/create-email-campaign'

import { TestBed } from '../../../../tests/unit/TestBed'
import { SingleEmailComposeForm } from './SingleEmailComposeForm'

const role = roleObj as IDealRole
// IDeal type is not in compliance with what is actually stored in redux.
// TODO: fix `as unknown` when deal types are improved
const deal = (dealObj as unknown) as IDeal
const checklists = keyBy(checklistsArray as IDealChecklist[], 'id')
const tasks = keyBy<IDealTask>(tasksArray as IDealTask[], 'id')

jest.mock('models/email/create-email-campaign')
jest.mock('models/contacts/search-contacts')
jest.mock('models/contacts/get-contacts-tags')
jest.mock('models/filter-segments/get-segments')

describe('BulkEmailComposeForm', () => {
  /**
   * // https://gitlab.com/rechat/web/issues/3389
   * due_date should not be null when schedule is removed. null due_date means
   * draft.
   */
  test('Deal roles are suggested if deal prop is passed', async () => {
    const $ = render(
      <TestBed
        reduxState={{
          deals: { roles: keyBy([role], 'id'), checklists, tasks }
        }}
      >
        <SingleEmailComposeForm
          deal={deal}
          initialValues={{ subject: 'subject' }}
        />
      </TestBed>
    )

    fireEvent.change($.getByTestId('email-recipients-input'), {
      target: { value: 'd' }
    })

    const roleSuggestion = await $.findAllByText('deal@role.com')

    //  click deal role suggestion
    fireEvent.click(roleSuggestion[0])

    // submit compose form
    fireEvent.click($.getByTestId('compose-send-email'))

    expect(createEmailCampaign).toBeCalledWith(
      expect.objectContaining({
        to: [
          {
            recipient_type: 'Email',
            email: 'deal@role.com'
          }
        ]
      } as IEmailCampaignInput)
    )
  })
})
