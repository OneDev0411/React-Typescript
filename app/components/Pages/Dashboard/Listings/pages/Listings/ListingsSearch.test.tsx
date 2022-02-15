import { render, screen, fireEvent, waitFor } from '@testing-library/react'

import { getDealsListings } from '@app/models/listings/listing/get-deals-listings'
import { getBrandListings } from '@app/models/listings/search/get-brand-listings'
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

jest.mock('@app/models/Deal/role/get-definitions', () => ({
  getDefinitions: () => jest.fn(() => [])
}))

describe('Listings page / search', () => {
  describe('When Listings table has data', () => {
    beforeAll(() => {
      jest.resetAllMocks()

      const mockedGetTasks = getTasks as jest.MockedFunction<typeof getTasks>

      mockedGetTasks.mockReturnValue(Promise.resolve(MockOpenHouseTasksEmpty))

      const mockedGetBrandListings =
        getBrandListings as jest.MockedFunction<any>

      mockedGetBrandListings.mockReturnValue(
        Promise.resolve(MockBrandListingsWithData)
      )

      const mockedGetDealsListings =
        getDealsListings as jest.MockedFunction<any>

      mockedGetDealsListings.mockReturnValue(
        Promise.resolve(MockDealsListingsWithData)
      )
    })

    it('should find the one item if input value was "red"', async () => {
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

        expect(screen.getAllByTestId('table-row').length).toBe(1)
        expect(screen.getByText('2137 Red Mountain Road')).toBeInTheDocument()
      })
    })

    it('should find the two item if input value was "street"', async () => {
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

      fireEvent.input(input, { target: { value: 'street' } })

      await waitFor(() => {
        expect(input.value).toBe('street')

        expect(screen.getAllByTestId('table-row').length).toBe(2)
        expect(
          screen.getByText('2555 N Pearl Street Unit RR3')
        ).toBeInTheDocument()
        expect(
          screen.getByText('988 Decatur Street Unit 2')
        ).toBeInTheDocument()
        expect(
          screen.queryByText('2137 Red Mountain Road')
        ).not.toBeInTheDocument()
      })
    })

    it('should not find any item if input value was "something else"', async () => {
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

      fireEvent.input(input, { target: { value: 'something else' } })

      await waitFor(() => {
        expect(input.value).toBe('something else')

        expect(screen.queryAllByTestId('table-row').length).toBe(0)
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

      const mockedGetDealsListings =
        getDealsListings as jest.MockedFunction<any>

      mockedGetDealsListings.mockReturnValue(
        Promise.resolve(MockDealsListingsEmpty)
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
  })
})
