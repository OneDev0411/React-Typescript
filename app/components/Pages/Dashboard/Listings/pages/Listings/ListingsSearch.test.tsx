import {
  render,
  screen,
  fireEvent,
  waitFor,
  within
} from '@testing-library/react'

import { getDealsListings } from '@app/models/listings/listing/get-deals-listings'
import { getBrandListings } from '@app/models/listings/search/get-brand-listings'
import { byValert as getBrandListingsCount } from '@app/models/listings/search/get-listings-count'
import { getTasks } from '@app/models/tasks/get-tasks'
import MockBrandListingsEmpty from 'tests/unit/fixtures/listing/brandListings/brandListingsEmpty.json'
import MockBrandListingsWithData from 'tests/unit/fixtures/listing/brandListings/brandListingsWithData.json'
import MockDealsListingsEmpty from 'tests/unit/fixtures/listing/dealsListings/dealsListingsEmpty.json'
import MockDealsListingsWithData from 'tests/unit/fixtures/listing/dealsListings/dealsListingsWithData.json'
import MockOpenHouseTasksEmpty from 'tests/unit/fixtures/open-house/tasks/tasksEmpty.json'

import {
  ListingsPageTestProvider,
  routerProps
} from './ListingsPageTestProvider'

import Listings from './index'

jest.mock('react-virtualized-auto-sizer')
jest.mock('react-window')

jest.mock('@app/models/tasks/get-tasks')
jest.mock('@app/models/listings/listing/get-deals-listings')
jest.mock('@app/models/listings/search/get-brand-listings')
jest.mock('@app/models/listings/search/get-listings-count')

jest.mock('@app/models/Deal/role/get-definitions', () => ({
  getDefinitions: () => jest.fn(() => [])
}))

describe('Listings page / search', () => {
  describe('When Listings table has data', () => {
    beforeEach(() => {
      const mockedGetTasks = getTasks as jest.MockedFunction<typeof getTasks>

      mockedGetTasks.mockReturnValue(Promise.resolve(MockOpenHouseTasksEmpty))

      const mockedGetBrandListings =
        getBrandListings as jest.MockedFunction<any>

      mockedGetBrandListings.mockReturnValue(
        Promise.resolve(MockBrandListingsWithData)
      )

      const mockedGetBrandListingsCount =
        getBrandListingsCount as jest.MockedFunction<any>

      mockedGetBrandListingsCount.mockReturnValue(Promise.resolve(1200))

      const mockedGetDealsListings =
        getDealsListings as jest.MockedFunction<any>

      mockedGetDealsListings.mockReturnValue(
        Promise.resolve({ listings: MockDealsListingsWithData, count: 100 })
      )
    })

    afterEach(() => {
      jest.resetAllMocks()
    })

    it('should call the api with "red" search parameter', async () => {
      render(
        <ListingsPageTestProvider>
          <Listings {...routerProps} />
        </ListingsPageTestProvider>
      )

      await waitFor(() => {
        // We have total 4 listings in the mock data
        expect(screen.getAllByTestId('table-row').length).toBe(4)
      })

      const input = screen.getByPlaceholderText('Search') as HTMLInputElement

      fireEvent.input(input, { target: { value: 'red' } })

      await waitFor(() => {
        expect(input.value).toBe('red')
        expect(getBrandListings).toHaveBeenLastCalledWith(
          expect.objectContaining({
            filters: expect.objectContaining({
              search: 'red'
            })
          })
        )
      })
    })

    it('should call the api when pagination is happen', async () => {
      render(
        <ListingsPageTestProvider>
          <Listings {...routerProps} />
        </ListingsPageTestProvider>
      )

      await waitFor(() => {
        // We have total 4 listings in the mock data
        expect(screen.getAllByTestId('table-row').length).toBe(4)
      })

      const buttonElement = within(screen.getByTestId('pagination')).getByText(
        '2'
      ) as HTMLButtonElement

      fireEvent.click(buttonElement)

      await waitFor(() => {
        expect(getBrandListings).toHaveBeenLastCalledWith(
          expect.objectContaining({
            options: expect.objectContaining({
              offset: 200
            })
          })
        )
      })
    })
  })

  describe('When Listings table is empty', () => {
    beforeAll(() => {
      jest.resetAllMocks()

      const mockedGetTasks = getTasks as jest.MockedFunction<typeof getTasks>

      mockedGetTasks.mockReturnValue(Promise.resolve(MockOpenHouseTasksEmpty))

      const mockedGetBrandListings =
        getBrandListings as jest.MockedFunction<any>

      mockedGetBrandListings.mockReturnValue(
        Promise.resolve(MockBrandListingsEmpty)
      )

      const mockedGetBrandListingsCount =
        getBrandListingsCount as jest.MockedFunction<any>

      mockedGetBrandListingsCount.mockReturnValue(Promise.resolve(0))

      const mockedGetDealsListings =
        getDealsListings as jest.MockedFunction<any>

      mockedGetDealsListings.mockReturnValue(
        Promise.resolve({ listings: MockDealsListingsEmpty, count: 0 })
      )
    })

    it('should show Empty State Component when it is searching', async () => {
      render(
        <ListingsPageTestProvider>
          <Listings {...routerProps} />
        </ListingsPageTestProvider>
      )

      await waitFor(() =>
        expect(
          screen.getByText('You don’t have any listings yet.')
        ).toBeInTheDocument()
      )

      const input = screen.getByPlaceholderText('Search') as HTMLInputElement

      fireEvent.input(input, { target: { value: 'something' } })

      await waitFor(() => {
        expect(input.value).toBe('something')

        expect(screen.getByText('No Results')).toBeInTheDocument()
      })
    })

    it('should not render the pagination', async () => {
      render(
        <ListingsPageTestProvider>
          <Listings {...routerProps} />
        </ListingsPageTestProvider>
      )

      await waitFor(() =>
        expect(
          screen.getByText('You don’t have any listings yet.')
        ).toBeInTheDocument()
      )

      await waitFor(() =>
        expect(screen.queryByTestId('pagination')).not.toBeInTheDocument()
      )
    })
  })
})
