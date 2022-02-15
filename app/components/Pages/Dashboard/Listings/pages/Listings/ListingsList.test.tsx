import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { browserHistory } from 'react-router'

import { getDealsListings } from '@app/models/listings/listing/get-deals-listings'
import { getBrandListings } from '@app/models/listings/search/get-brand-listings'
import { getTasks } from '@app/models/tasks/get-tasks'
import MockBrandListingsEmpty from 'tests/unit/fixtures/listing/brandListings/brandListingsEmpty.json'
import MockBrandListingsWithData from 'tests/unit/fixtures/listing/brandListings/brandListingsWithData.json'
import MockDealsListingsEmpty from 'tests/unit/fixtures/listing/dealsListings/dealsListingsEmpty.json'
import MockDealsListingsWithData from 'tests/unit/fixtures/listing/dealsListings/dealsListingsWithData.json'
import MockOpenHouseTasksEmpty from 'tests/unit/fixtures/open-house/tasks/tasksEmpty.json'
import MockOpenHouseTasksWithData from 'tests/unit/fixtures/open-house/tasks/tasksWithData.json'

import ListingsList from './ListingsList'
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
jest.mock(
  '@app/views/components/TextEditor/features/Image/utils/get-image-dimensions'
)

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
        expect(screen.getAllByTestId('table-row').length).toBe(4)
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
          screen.getByText('You don’t have any listings yet.')
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
        expect(screen.getByText('No Results')).toBeInTheDocument()
      )
    })
  })
})

describe('ListingsPage / Add mls account button', () => {
  it('should redirect to add mls account and open the modal when user clicks on the button', async () => {
    render(
      <ListingsPageTestProvider>
        <Listings {...routerProps} />
      </ListingsPageTestProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('Add MLS Account')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText('Add MLS Account'))

    await waitFor(() => {
      expect(browserHistory.getCurrentLocation().pathname).toBe(
        '/dashboard/account/connected-accounts'
      )
      expect(browserHistory.getCurrentLocation().query).toEqual({
        action: 'add-mls-account'
      })
    })
  })
})
