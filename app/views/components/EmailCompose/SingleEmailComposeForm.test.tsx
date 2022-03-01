import { fireEvent, render, screen } from '@testing-library/react'
import { keyBy } from 'lodash'

import dealObj from 'fixtures/deal/164ca424-6732-11e9-82bf-0a95998482ac.json'
import checklistsArray from 'fixtures/deal/checklists.json'
import roleObj from 'fixtures/deal/roles/18284e38-6732-11e9-91b6-0a95998482ac.json'
import tasksArray from 'fixtures/deal/tasks.json'
import { createEmailCampaign } from 'models/email/create-email-campaign'

import { TestBed } from '../../../../tests/unit/TestBed'

import { SingleEmailComposeForm } from './SingleEmailComposeForm'

const role = roleObj as any
// IDeal type is not in compliance with what is actually stored in redux.
// TODO: fix `as unknown` when deal types are improved
const deal = dealObj as unknown as IDeal
const checklists = keyBy(checklistsArray as IDealChecklist[], 'id')
const tasks = keyBy<IDealTask>(tasksArray as any, 'id')

jest.mock('models/email/create-email-campaign')
jest.mock('models/contacts/search-contacts')
jest.mock('models/contacts/get-contacts-tags')
jest.mock('models/filter-segments/get-segments')
jest.mock('models/o-auth-accounts/get-o-auth-accounts')
jest.mock('use-dropbox-chooser')

describe('BulkEmailComposeForm', () => {
  /**
   * // https://gitlab.com/rechat/web/issues/3389
   * due_date should not be null when schedule is removed. null due_date means
   * draft.
   */
  // TODO: something is wrong with this test and it fails on pipelines with this error
  // TypeError: Network request failed
  //   at node_modules/whatwg-fetch/dist/fetch.umd.js:535:18
  test.skip('Deal roles are suggested if deal prop is passed', async () => {
    render(
      <TestBed
        reduxState={{
          contacts: {
            oAuthAccounts: {
              loading: {
                microsoft: false,
                google: false
              },
              list: {}
            }
          },
          deals: {
            list: { [deal.id]: deal },
            roles: keyBy([role], 'id'),
            checklists,
            tasks
          }
        }}
      >
        <SingleEmailComposeForm
          deal={deal}
          initialValues={{ subject: 'subject' }}
        />
      </TestBed>
    )

    // TODO: Mock context properly
    const roleSuggestion = await screen.findByText('Mr. Deal Role! (...)')

    //  click deal role suggestion
    fireEvent.click(roleSuggestion)

    // submit compose form
    fireEvent.click(screen.getByTestId('compose-send-email'))

    // It's added for template expression evaluation which delays the execution
    // of the props.sendEmail one tick. Not sure if there is a better way
    // to fix this issue but it's working.
    // @ts-ignore
    await new Promise(setTimeout)

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
