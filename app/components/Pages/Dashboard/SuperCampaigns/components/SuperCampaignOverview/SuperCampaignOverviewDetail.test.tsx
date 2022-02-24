import * as t from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import templateInstance from 'fixtures/marketing-center/template-instance.json'
import { TestBed } from 'tests/unit/TestBed'
import { makeControlledAsync } from 'tests/unit/utils/controllable-promise'

import { SuperCampaignProvider } from '../SuperCampaignProvider'

import SuperCampaignOverviewDetail from './SuperCampaignOverviewDetail'

const mockUpdateCampaignModel = makeControlledAsync(jest.fn())

jest.mock(
  '@app/models/super-campaign/update-super-campaign/update-super-campaign',
  () => async (superCampaignId: UUID, data: ISuperCampaignInput) => {
    await mockUpdateCampaignModel.fn(superCampaignId, data)

    return data
  }
)

const mockDateInMilliSeconds = new Date('2021-11-17T21:30:00').getTime()

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
    description:
      'This is a monthly newsletter that is sent out to Newsletter tag',
    due_at: mockDateInMilliSeconds / 1000
  }
}

interface Props {
  superCampaign: ISuperCampaign<'template_instance'>
  setSuperCampaign: (superCampaign: ISuperCampaign<'template_instance'>) => void
}

function Test({ superCampaign, setSuperCampaign }: Props) {
  return (
    <TestBed>
      <SuperCampaignProvider superCampaign={superCampaign}>
        <SuperCampaignOverviewDetail />
      </SuperCampaignProvider>
    </TestBed>
  )
}

function testRenderEmpty() {
  const $ = t.render(
    <Test superCampaign={testData.empty} setSuperCampaign={jest.fn()} />
  )

  expect($.getByTestId('super-campaign-details')).toMatchSnapshot(
    'details box without template'
  )
  expect($.getByText('Edit')).toBeInTheDocument()
}

function testRenderFilledWithTemplate() {
  const $ = t.render(
    <Test superCampaign={testData.filled} setSuperCampaign={jest.fn()} />
  )

  expect($.getByTestId('super-campaign-details')).toMatchSnapshot(
    'details box without template'
  )
  expect(
    $.getByTestId('super-campaign-detail-template').querySelector('iframe')
  ).toMatchSnapshot('details box template preview')

  // Just checking the button exists
  t.within($.getByTestId('super-campaign-detail-template')).getByText(
    'Edit Template'
  )
}

async function testEditFlow() {
  const setSuperCampaign = jest.fn()
  const $ = t.render(
    <Test superCampaign={testData.empty} setSuperCampaign={setSuperCampaign} />
  )

  // Drawer is not yet open
  expect(t.screen.getByText('Enter Campaign Details')).not.toBeVisible()

  // Clicking on Edit will open the drawer
  userEvent.click($.getByText('Edit'))
  expect(t.screen.getByText('Enter Campaign Details')).toBeVisible()

  // Fill in the drawer form
  const form = $.getByTestId('super-campaign-edit-form')
  const find = (testId: string, selector: string) => {
    const res = t.within(form).getByTestId(testId).querySelector(selector)

    if (!res) {
      throw new Error(`Element ${selector} not found.`)
    }

    return res
  }

  userEvent.type(
    find('subject', 'input'),
    `{selectall}${testData.filled.subject}`
  )
  userEvent.type(
    find('description', 'textarea'),
    `{selectall}${testData.filled.description}`
  )

  // Click on Save
  const saveButton = $.getByText('Save')

  t.fireEvent.click(saveButton)

  // Expect `updateSuperCampaign` model to have been called correctly
  mockUpdateCampaignModel.resolve()
  await t.waitFor(() =>
    expect(mockUpdateCampaignModel.mockFn).toHaveBeenCalledTimes(1)
  )

  const expected = expect.objectContaining({
    subject: testData.filled.subject,
    description: testData.filled.description
  })

  expect(mockUpdateCampaignModel.mockFn).toHaveBeenCalledWith(
    testData.empty.id,
    expected
  )

  // Expect `Provider.setSuperCampaign` to have been called correctly
  expect(setSuperCampaign).toHaveBeenCalledWith(expected)
}

function testReadOnlyMode() {
  const data = {
    ...testData.filled,
    executed_at: Date.now() / 1000
  }
  const $ = t.render(<Test superCampaign={data} setSuperCampaign={jest.fn()} />)

  expect($.queryByText('Edit')).toBeNull()
}

describe('Super Campaign/Overview/Detail', () => {
  beforeAll(() => {
    jest
      .spyOn(Date.prototype, 'getTime')
      .mockImplementation(() => mockDateInMilliSeconds)
  })

  afterAll(() => {
    jest.restoreAllMocks()
  })

  describe('When not executed', () => {
    it('renders empty when draft campaign is given', testRenderEmpty)
    it('renders template when there is one', testRenderFilledWithTemplate)
    it.skip('completes the edit super campaign flow', testEditFlow)
  })
  describe('When executed', () => {
    it('renders in read-only mode', testReadOnlyMode)
  })
})
