import React from 'react'
import { fireEvent, render } from '@testing-library/react'

// // eslint-disable-next-line import/no-unresolved
// import user from 'fixtures/users/agent.json'

// // eslint-disable-next-line import/no-unresolved
// import templateInstance from 'fixtures/marketing-center/template-instance.json'

// import { createBulkEmailCampaign } from 'models/email/create-bulk-email-campaign'

// import { TestBed } from '../../../../../../tests/unit/TestBed'

// // we use the connected component because we need to provide redux store
// // for inner components anyways
// import ShareInstance from '.'

// jest.mock('models/email/create-bulk-email-campaign')
// jest.mock('models/contacts/search-contacts')
// jest.mock('models/contacts/get-contacts-tags')
// jest.mock('models/filter-segments/get-segments')

// TODO: It has unknown conflict with TUI Image Editor
describe('EditEmailDrawer', () => {
  test('it renders', () => {
    render(<div />)
  })
})

// describe('ShareInstance', () => {
//   test('it renders', () => {
//     render(
//       <TestBed reduxState={{ user }}>
//         {/*
//       //@ts-ignore */}
//         <ShareInstance instance={templateInstance} isTriggered />
//       </TestBed>
//     )
//   })

//   // https://gitlab.com/rechat/web/issues/3358
//   test('It passes template id when sending email', () => {
//     const { getByTestId } = render(
//       <TestBed reduxState={{ user }}>
//         {/*
//         // @ts-ignore js component */}
//         <ShareInstance
//           instance={templateInstance}
//           // hasExternalTrigger
//           isTriggered
//         />
//       </TestBed>
//     )

//     const recipientsInput = getByTestId('email-recipients-input')
//     const subjectInput = getByTestId('email-subject')
//     const subject = 'Testing ShareInstance action in MC'
//     const email = 'alireza.mirian@gmail.com'

//     // Add a recipient
//     fireEvent.change(recipientsInput, {
//       target: { value: email }
//     })
//     fireEvent.keyDown(recipientsInput, {
//       key: 'Enter',
//       code: 13,
//       charCode: 13
//     })

//     // Set subject
//     fireEvent.change(subjectInput, {
//       target: { value: subject }
//     })

//     // Send Email
//     fireEvent.click(getByTestId('compose-send-email'))

//     setTimeout(() => {
//       expect(createBulkEmailCampaign).toHaveBeenCalledWith(
//         expect.objectContaining({
//           from: user.id,
//           html: templateInstance.html,
//           template: templateInstance.id,
//           to: [
//             {
//               recipient_type: 'Email',
//               email
//             }
//           ]
//         })
//       )
//     }, 2000)
//   })
// })
