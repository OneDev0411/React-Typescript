import React from 'react'
import { cleanup } from '@testing-library/react'

import { emailCampaignEmail as emailCampaignEmailObj } from 'fixtures/insights/insight'

import { ContactsListType } from '../../../components/Pages/Dashboard/MarketingInsights/Insight/types'
import { renderWithTheme } from '../../../../tests/unit/utils/render-with-theme'

import ContactInfo from '.'

const emailCampaignEmail = emailCampaignEmailObj as IEmailCampaignEmail

describe('ContactInfo tests', () => {
  afterEach(cleanup)

  // Related issue: 2846
  it('should renders a contact with link', () => {
    const item: ContactsListType = {
      id: '295c3d1e-83a6-11e9-a74e-0a95998482ac',
      display_name: 'Mojtaba Espari Pour',
      profile_image_url:
        'https://d2dzyv4cb7po1i.cloudfront.net/e58aa965-600f-4b3c-a400-fd0f52a66b6f/087ee010-8455-11e9-ba54-9bd150ac2178.jpeg',
      to: 'esparipour@gmail.com',
      contact: 'e58aa965-600f-4b3c-a400-fd0f52a66b6f',
      unsubscribed: 0,
      original_data: emailCampaignEmail,
      failed: 0,
      opened: 0,
      clicked: 0
    }

    const { queryByText } = renderWithTheme(<ContactInfo data={item} />)
    const name_el = queryByText(item.display_name!)

    expect(name_el).not.toBeNull()
    // @ts-ignore
    expect(name_el.nodeName).toBe('A')
  })

  // Related issue: 2846
  it('should renders a user without link', () => {
    const item: ContactsListType = {
      id: '295c3d1e-13a6-13e9-a74a-0a99998382ac',
      display_name: 'Bahram Nouraei',
      profile_image_url:
        'https://d2dzyv4cb7po1i.cloudfront.net/e58aa965-600f-4b3c-a400-fd0f52a66b6f/087ee010-8455-11e9-ba54-9bd150ac2178.jpeg',
      to: 'bahram@gmail.com',
      contact: null,
      original_data: emailCampaignEmail,
      unsubscribed: 0,
      failed: 0,
      opened: 0,
      clicked: 0
    }

    const { queryByText } = renderWithTheme(<ContactInfo data={item} />)
    const name_el = queryByText(item.display_name!)

    expect(name_el).not.toBeNull()
    // @ts-ignore
    expect(name_el.nodeName).not.toBe('A')
  })
})
