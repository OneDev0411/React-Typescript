import deal from 'fixtures/deal/live-seller'

import { getFileUrl } from '.'

describe('Test deal actions get-file-url', () => {
  it('Should return nothing when task is generic and has no attachment', () => {
    const task = {
      form: null,
      room: {
        attachments: []
      }
    }

    const links = getFileUrl({
      type: 'task',
      deal,
      task,
      envelopes: [],
      isBackOffice: false
    })

    expect(links).toHaveLength(0)
  })
})
