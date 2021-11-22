import * as t from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TestBed } from 'tests/unit/TestBed';

import templateInstance from 'fixtures/marketing-center/template-instance.json'
import { SuperCampaignDetailProvider } from '../SuperCampaignDetailProvider';
import SuperCampaignOverviewDetail from './SuperCampaignOverviewDetail';

const empty: ISuperCampaign<'template_instance'> = {
  id: '1',
  created_at: 1,
  updated_at: 1,
  type: 'super_campaign',

  brand: '123',
  created_by: '456',
  tags: null,
  eligible_brands: ['123'],
  // @ts-ignore: importing fixtures from JSON upsets TS
  template_instance: templateInstance
}
const testData: Record<string, ISuperCampaign<'template_instance'>> = {
  empty,
  filled: {
    ...empty,
    subject: 'Market Report Q3',
    description: 'This is a monthly newsletter that is sent out to Newsletter tag',
    due_at: new Date('2021-11-17T21:30:00').getTime() / 1000
  }
}

interface Props {
  superCampaign: ISuperCampaign<'template_instance'>
}

function Test({ superCampaign }: Props) {
  return (
    <TestBed>
      <SuperCampaignDetailProvider
        superCampaign={superCampaign}
        setSuperCampaign={jest.fn()}
      >
        <SuperCampaignOverviewDetail />
      </SuperCampaignDetailProvider>
    </TestBed>
  )
}

function testRenderEmpty() {
  const $ = t.render(<Test superCampaign={testData.empty} />)
  expect($.getByTestId('super-campaign-details')).toMatchSnapshot('details box without template')
  expect($.getByText('Edit')).toBeInTheDocument()
}

function testRenderFilledWithTemplate() {
  const $ = t.render(<Test superCampaign={testData.filled} />)
  expect($.getByTestId('super-campaign-details')).toMatchSnapshot('details box without template')
  expect($.getByTestId('super-campaign-detail-template').querySelector('iframe')).toMatchSnapshot('details box template preview')

  // Just checking the button exists
  t.within($.getByTestId('super-campaign-detail-template')).getByText('Edit Template');
}

async function testEditFlow() {
  const $ = t.render(<Test superCampaign={testData.empty} />)
  expect(t.screen.getByText('Enter Campaign Details')).not.toBeVisible()
  userEvent.click($.getByText('Edit'))
  expect(t.screen.getByText('Enter Campaign Details')).toBeVisible()

  const form = $.getByTestId('super-campaign-edit-form')
  const find = (testId: string, selector: string) => {
    const res = t.within(form).getByTestId(testId).querySelector(selector)
    if (!res) {
      throw new Error(`Element ${selector} not found.`)
    }
    return res
  }
  userEvent.type(find('subject', 'input'), `{selectall}${testData.filled.subject}`)
  userEvent.type(find('description', 'textarea'), `{selectall}${testData.filled.subject}`)

  userEvent.click($.getByText('Save'))
}

function testReadOnlyMode() {

}

describe('Super Campaign/Overview/Detail', () => {
  describe('When not executed', () => {
    it('renders empty when draft campaign is given', testRenderEmpty)
    it('renders template when there is one', testRenderFilledWithTemplate)
    it('opens the edit drawer on click', testEditFlow)
  })
  describe('When executed', () => {
    it('renders in read-only mode', testReadOnlyMode)
  })
})
