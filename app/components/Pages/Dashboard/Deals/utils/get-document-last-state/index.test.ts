// eslint-disable-next-line
import deal from 'fixtures/deal/live-seller'

import { getDocumentLastState } from '.'

describe('Test deal actions get-file-url', () => {
  it('Should return nothing when task is generic and has no attachment', () => {
    const task = {
      form: null,
      room: {
        attachments: []
      }
    }

    const links = getDocumentLastState({
      type: 'task',
      deal,
      task,
      envelopes: [],
      isBackOffice: false
    })

    expect(links).toHaveLength(0)
  })

  it('Should always return original file', () => {
    const task = {
      ...deal.checklists[0].tasks[1],
      submission: {
        file: {
          id: '123456',
          url: 'file.url'
        }
      }
    }

    const links = getDocumentLastState({
      type: 'task',
      deal,
      task,
      envelopes: [],
      isBackOffice: false
    })

    expect(links).toHaveLength(1)
    expect(links[0]).toHaveProperty('originalFile')
  })
})
