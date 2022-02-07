import {
  render,
  screen,
  fireEvent,
  waitFor,
  getByText
} from '@testing-library/react'
import Listings from './index'

import {
  ListingsPageTestProvider,
  routerProps
} from './ListingsPageTestProvider'
import MockBrandListingsWithData from 'tests/unit/fixtures/listing/brandListings/brandListingsWithData.json'
import MockDealsListingsWithData from 'tests/unit/fixtures/listing/dealsListings/dealsListingsWithData.json'
import MockOpenHouseTasksWithData from 'tests/unit/fixtures/open-house/tasks/tasksWithData.json'

jest.mock('react-virtualized-auto-sizer')
jest.mock('react-window')

jest.mock('@app/models/tasks/get-tasks', () => ({
  getTasks: () => Promise.resolve(MockOpenHouseTasksWithData)
}))
jest.mock('@app/models/listings/listing/get-deals-listings', () => ({
  getDealsListings: () => Promise.resolve(MockDealsListingsWithData)
}))
jest.mock('@app/models/listings/search/get-brand-listings', () => ({
  getBrandListings: () => Promise.resolve(MockBrandListingsWithData)
}))

describe('Listings page / List item', () => {
  describe('Deals button', () => {
    it('should be View Deal when the deal exists in deals list', async () => {
      const MockedListingsId = MockDealsListingsWithData[1].id
      const customReduxState = {
        deals: {
          list: {
            the_mocked_deal_id: {
              id: 'the_mocked_deal_id',
              listing: MockedListingsId
            }
          }
        }
      }

      render(
        <ListingsPageTestProvider customReduxState={customReduxState}>
          <Listings {...routerProps} />
        </ListingsPageTestProvider>
      )

      await waitFor(() => {
        const items = screen.getAllByTestId(`table-row`)
        expect(getByText(items[1], 'View Deal')).toBeInTheDocument()
      })
    })

    it('should be Create Deal when the deal not exists in deals list', async () => {
      render(
        <ListingsPageTestProvider>
          <Listings {...routerProps} />
        </ListingsPageTestProvider>
      )

      await waitFor(() => {
        const items = screen.getAllByTestId(`table-row`)
        expect(getByText(items[1], 'Create Deal')).toBeInTheDocument()
      })
    })
  })
})
