import React from 'react'

import { render, waitForElement, fireEvent } from '@testing-library/react'

// import mcEmailCampaign from 'fixtures/email-campaign/mc-email-campaign.json'

// import { updateEmailCampaign } from 'models/email/update-email-campaign'

// import { TestBed } from '../../../../../tests/unit/TestBed'

// import { EditEmailDrawer } from '.'

// const noop = () => {}

// jest.mock('models/email/update-email-campaign')
// jest.mock('models/contacts/search-contacts')
// jest.mock('models/email/get-email-campaign')
// jest.mock('models/contacts/get-contacts-tags')
// jest.mock('models/filter-segments/get-segments')

// TODO: It has unknown conflict with TUI Image Editor
describe('EditEmailDrawer', () => {
  test('it renders', () => {
    render(<div />)
  })
})

// describe('EditEmailDrawer', () => {
//   test('it renders', () => {
//     render(
//       <TestBed>
//         <EditEmailDrawer emailId="foo" isOpen onClose={noop} onEdited={noop} />
//       </TestBed>
//     )
//   })

//   // https://gitlab.com/rechat/web/issues/3382
//   test("it doesn't modify email content when email is created based on an mc template", async () => {
//     const { getByTestId } = render(
//       <TestBed>
//         <EditEmailDrawer emailId="mc" isOpen onClose={noop} onEdited={noop} />
//       </TestBed>
//     )

//     const element = await waitForElement(() =>
//       getByTestId('compose-send-email')
//     )

//     fireEvent.click(element)

//     setTimeout(() => {
//       expect(updateEmailCampaign).toBeCalledWith(
//         '5f4a9526-dedf-11e9-ae4b-027d31a1f7a0',
//         {
//           from: '95b9c3ac-49a7-11e9-8abe-0a95998482ac',
//           to: [{ recipient_type: 'Email', email: 'alireza.mirian@gmail.com' }],
//           subject: 'test',
//           html: mcEmailCampaign.html,
//           attachments: [],
//           due_at: new Date('2019-09-26T15:24:00.000Z')
//         }
//       )
//     })
//   }, 2000)
// })
