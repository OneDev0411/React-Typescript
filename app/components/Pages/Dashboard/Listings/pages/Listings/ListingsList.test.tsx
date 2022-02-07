import { render, screen, waitFor } from '@testing-library/react'
import ListingsList from './ListingsList'
import { ListingsPageTestProvider } from './ListingsPageTestProvider'
import { getBrandListings } from '@app/models/listings/search/get-brand-listings'
import MockBrandListingsWithData from 'tests/unit/fixtures/listing/brandListings/brandListingsWithData.json'
import MockBrandListingsEmpty from 'tests/unit/fixtures/listing/brandListings/brandListingsEmpty.json'
import { getDealsListings } from '@app/models/listings/listing/get-deals-listings'
import MockDealsListingsWithData from 'tests/unit/fixtures/listing/dealsListings/dealsListingsWithData.json'
import MockDealsListingsEmpty from 'tests/unit/fixtures/listing/dealsListings/dealsListingsEmpty.json'
import { getTasks } from '@app/models/tasks/get-tasks'
import MockOpenHouseTasksWithData from 'tests/unit/fixtures/open-house/tasks/tasksWithData.json'
import MockOpenHouseTasksEmpty from 'tests/unit/fixtures/open-house/tasks/tasksEmpty.json'

jest.mock('react-virtualized-auto-sizer')
jest.mock('react-window')

jest.mock('@app/models/tasks/get-tasks')
jest.mock('@app/models/listings/listing/get-deals-listings')
jest.mock('@app/models/listings/search/get-brand-listings')

describe('Listings page / Table rendering', () => {
  beforeAll(() => {
    jest.resetAllMocks()

    const mockedGetTasks = getTasks as jest.MockedFunction<typeof getTasks>
    mockedGetTasks.mockReturnValue(Promise.resolve(MockOpenHouseTasksWithData))

    const mockedGetBrandListings = getBrandListings as jest.MockedFunction<any>
    mockedGetBrandListings.mockReturnValue(
      Promise.resolve(MockBrandListingsWithData)
    )

    const mockedGetDealsListings = getDealsListings as jest.MockedFunction<any>
    mockedGetDealsListings.mockReturnValue(
      Promise.resolve(MockDealsListingsWithData)
    )
  })
  describe('When Listings is not empty', () => {
    it('should render all items of listings list when deals listings is not empty', async () => {
      render(
        <ListingsPageTestProvider>
          <ListingsList searchTerm="" />
        </ListingsPageTestProvider>
      )

      await waitFor(() =>
        // We have total 4 listings in the mock data
        expect(screen.getAllByTestId(`table-row`).length).toBe(4)
      )
    })
  })

  describe('When Listings is empty', () => {
    beforeAll(() => {
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

    it('should show Empty State Component when it is not searching', async () => {
      render(
        <ListingsPageTestProvider>
          <ListingsList searchTerm="" />
        </ListingsPageTestProvider>
      )

      await waitFor(() =>
        expect(
          screen.getByText(`You don’t have any listings yet.`)
        ).toBeInTheDocument()
      )
    })

    it('should show Empty State Component when it is searching', async () => {
      render(
        <ListingsPageTestProvider>
          <ListingsList searchTerm="some thing" />
        </ListingsPageTestProvider>
      )

      await waitFor(() =>
        expect(screen.getByText(`No Results`)).toBeInTheDocument()
      )
    })
  })
})
