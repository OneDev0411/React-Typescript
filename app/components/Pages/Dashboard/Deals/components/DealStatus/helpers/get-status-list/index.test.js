import liveSeller from 'fixtures/deal/live-seller'

import { getStatusList } from '.'

describe('Test deal statuses', () => {
  it.only('Should work with live seller deals', () => {
    const list = getStatusList(liveSeller, true)

    expect(list.length > 0)
  })
})
