import React from 'react'
import { render, cleanup } from '@testing-library/react'

import mockDate, { RealDate } from 'utils/test-utils/mock-date'
import InfoColumn from './InfoColumn'

describe('Marketing Insights: InfoColumn tests', function() {
  let baseItem = {
    id: '83ad43e4-6be6-11e9-a623-0a95998482ac',
    created_at: 1556697340.69654,
    updated_at: null,
    deleted_at: null,
    created_by: '7b5d2618-43e2-11e9-ad8c-0a95998482ac',
    brand: 'f10d87de-9df0-11e7-bab9-0242ac110003',
    subject: 'hello',
    include_signature: false,
    html: '<p><br></p>',
    due_at: 1556697340.69654,
    executed_at: null,
    individual: true,
    accepted: 0,
    rejected: 0,
    delivered: 1,
    failed: 0,
    opened: 0,
    clicked: 0,
    unsubscribed: 0,
    complained: 0,
    stored: 0,
    text: '',
    type: 'email_campaign',
    sent: 1,
    recipients: [
      {
        id: '83ae0fc2-6be6-11e9-a624-0a95998482ac',
        created_at: '2019-05-01T07:55:40.696Z',
        updated_at: null,
        deleted_at: null,
        campaign: '83ad43e4-6be6-11e9-a623-0a95998482ac',
        tag: null,
        list: null,
        contact: null,
        email: 'hi@mojtabast.com',
        recipient_type: 'To',
        eid: '83ae0fc2-6be6-11e9-a624-0a95998482ac',
        ord: '14',
        type: 'email_campaign_recipient'
      }
    ]
  }

  afterEach(() => {
    global.Date = RealDate
    cleanup()
  })

  // Related Issue: 2717
  it('should render in progress email correctly', function() {
    mockDate('2027-01-01T12:34:56z')

    const item = baseItem
    const { queryByText } = render(<InfoColumn data={item} />)

    expect(queryByText('In Progress')).not.toBeNull()
  })

  // Related Issue: 2717
  it('should render in progress email correctly', function() {
    const item = {
      ...baseItem,
      executed_at: 1559327400.90623
    }

    const { queryByText } = render(<InfoColumn data={item} />)

    expect(queryByText('In Progress')).toBeNull()
    expect(queryByText('Scheduled')).toBeNull()
  })
})
