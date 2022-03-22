import {
  render,
  screen,
  fireEvent,
  waitFor,
  getByText,
  queryByText
} from '@testing-library/react'
import { browserHistory } from 'react-router'

import MockActiveTeam from 'tests/unit/fixtures/active-team/8cb4a358-8973-11e7-9089-0242ac110003.json'
import MockBrand from 'tests/unit/fixtures/brands/e44ccc36-6530-11e9-b99a-0a95998482ac.json'
import MockBrandListingsWithData from 'tests/unit/fixtures/listing/brandListings/brandListingsWithData.json'
import MockDealsListingsWithData from 'tests/unit/fixtures/listing/dealsListings/dealsListingsWithData.json'
import MockListing from 'tests/unit/fixtures/listing/listingWithProposedAgent.json'
import MockOpenHouseTasksWithData from 'tests/unit/fixtures/open-house/tasks/tasksWithData.json'
import MockUserWithDeals from 'tests/unit/fixtures/users/agent.json'
import MockUserWithoutDeals from 'tests/unit/fixtures/users/withoutDeals.json'

import {
  ListingsPageTestProvider,
  routerProps
} from './ListingsPageTestProvider'

import Listings from './index'

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

// Listing modal mocks
jest.mock('@app/utils/load-js')

jest.mock('@app/models/user/log-activity', () => ({
  logUserActivity: jest.fn()
}))

jest.mock(
  '@app/models/listings/listing/get-listing',
  () => () => Promise.resolve(MockListing)
)

// OH registration page mocks
jest.mock('@app/models/instant-marketing/get-templates', () => ({
  getTemplates: () => Promise.resolve([]),
  getBrands: () => Promise.resolve([])
}))

jest.mock('@app/models/brand/get-brand-by-id', () => ({
  getBrandById: () => Promise.resolve(MockBrand)
}))
jest.mock('@app/models/instant-marketing/load-template', () => ({
  loadTemplateHtml: () => Promise.resolve('')
}))

describe('Listings page / List item data', () => {
  it('should render listing address', async () => {
    render(
      <ListingsPageTestProvider>
        <Listings {...routerProps} />
      </ListingsPageTestProvider>
    )

    await waitFor(() => {
      const items = screen.getAllByTestId('table-row')

      expect(getByText(items[0], '2137 Red Mountain Road')).toBeInTheDocument()
    })
  })
  it('should render listing mls source', async () => {
    render(
      <ListingsPageTestProvider>
        <Listings {...routerProps} />
      </ListingsPageTestProvider>
    )

    await waitFor(() => {
      const items = screen.getAllByTestId('table-row')

      expect(getByText(items[0], 'AGS')).toBeInTheDocument()
    })
  })
  it('should render listing status', async () => {
    render(
      <ListingsPageTestProvider>
        <Listings {...routerProps} />
      </ListingsPageTestProvider>
    )

    await waitFor(() => {
      const items = screen.getAllByTestId('table-row')

      expect(getByText(items[0], 'Active')).toBeInTheDocument()
    })
  })
  it('should render listing agent name', async () => {
    render(
      <ListingsPageTestProvider>
        <Listings {...routerProps} />
      </ListingsPageTestProvider>
    )

    await waitFor(() => {
      const items = screen.getAllByTestId('table-row')

      expect(getByText(items[0], 'Krista Klees')).toBeInTheDocument()
    })
  })
  it('should render listing price', async () => {
    render(
      <ListingsPageTestProvider>
        <Listings {...routerProps} />
      </ListingsPageTestProvider>
    )

    await waitFor(() => {
      const items = screen.getAllByTestId('table-row')

      expect(getByText(items[0], '$49,500,000')).toBeInTheDocument()
    })
  })
  it('should not render co-agent tag if the user is not a co-agent', async () => {
    render(
      <ListingsPageTestProvider>
        <Listings {...routerProps} />
      </ListingsPageTestProvider>
    )

    await waitFor(() => {
      const items = screen.getAllByTestId('table-row')

      expect(queryByText(items[0], 'Co-Agent')).not.toBeInTheDocument()
    })
  })
  it('should render co-agent tag if the user is the co-agent', async () => {
    const customReduxState = {
      user: {
        ...MockUserWithDeals,
        agents: [
          {
            id: '3d79c634-2135-11ec-abf1-42010a960002',
            email: 'maria.ienna@elliman.com',
            mlsid: 'RBNY-51427',
            mls: 'REBNY'
          }
        ]
      }
    }

    render(
      <ListingsPageTestProvider customReduxState={customReduxState}>
        <Listings {...routerProps} />
      </ListingsPageTestProvider>
    )

    await waitFor(() => {
      const items = screen.getAllByTestId('table-row')

      expect(queryByText(items[2], 'Co-Agent')).not.toBeInTheDocument()
    })
  })
})

describe('Listings page / List item buttons', () => {
  describe('Deals button', () => {
    it('should not be visable if user has not access to deals', async () => {
      const customReduxState = {
        user: MockUserWithoutDeals
      }

      render(
        <ListingsPageTestProvider customReduxState={customReduxState}>
          <Listings {...routerProps} />
        </ListingsPageTestProvider>
      )

      await waitFor(() => {
        expect(screen.queryByText('View Deal')).not.toBeInTheDocument()
        expect(screen.queryByText('Create Deal')).not.toBeInTheDocument()
      })
    })

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
        const items = screen.getAllByTestId('table-row')

        expect(getByText(items[1], 'View Deal')).toBeInTheDocument()
      })

      fireEvent.click(
        getByText(screen.getAllByTestId('table-row')[1], 'View Deal')
      )

      await waitFor(() => {
        expect(browserHistory.getCurrentLocation().pathname).toBe(
          '/dashboard/deals/the_mocked_deal_id'
        )
      })
    })

    it('should be Create Deal when the deal not exists in deals list', async () => {
      const MockedListingsId = MockDealsListingsWithData[1].id

      render(
        <ListingsPageTestProvider>
          <Listings {...routerProps} />
        </ListingsPageTestProvider>
      )

      await waitFor(() => {
        const items = screen.getAllByTestId('table-row')

        expect(getByText(items[1], 'Create Deal')).toBeInTheDocument()
      })

      fireEvent.click(
        getByText(screen.getAllByTestId('table-row')[1], 'Create Deal')
      )

      await waitFor(() => {
        expect(browserHistory.getCurrentLocation().pathname).toBe(
          '/dashboard/deals/create'
        )
        expect(browserHistory.getCurrentLocation().query).toEqual({
          listingId: MockedListingsId
        })
      })
    })
  })

  describe('Market button', () => {
    it('should be linked to marketing center', async () => {
      render(
        <ListingsPageTestProvider>
          <Listings {...routerProps} />
        </ListingsPageTestProvider>
      )

      await waitFor(() => {
        const items = screen.getAllByTestId('table-row')
        const marketButton = getByText(items[1], 'Market Listing')

        expect(marketButton).toBeInTheDocument()
        expect(marketButton.closest('a')?.href).toContain(
          '/dashboard/marketing/mls/bf6088b0-e757-11e8-80d6-0a95998482ac'
        )
      })
    })
  })

  describe('More Actions', () => {
    it('should open listing detail modal on view listing button click', async () => {
      render(
        <ListingsPageTestProvider>
          <Listings {...routerProps} />
        </ListingsPageTestProvider>
      )

      await waitFor(() => {
        const items = screen.getAllByTestId('table-row')

        expect(getByText(items[0], 'More Actions')).toBeInTheDocument()
      })

      // Open more actions menu
      fireEvent.click(
        getByText(screen.getAllByTestId('table-row')[0], 'More Actions')
      )

      await waitFor(() => {
        expect(screen.getByText('View Listing')).toBeInTheDocument()
      })

      // Open Listing detail modal
      fireEvent.click(screen.getByText('View Listing'))

      await waitFor(() => {
        // more actions menu should be closed
        expect(screen.queryByText('View Listing')).not.toBeInTheDocument()
        // listing detail modal should be open
        expect(screen.getByTestId('listing-details-modal')).toBeInTheDocument()
        // browser url should be /dashboard/listings/listing_id
        expect(browserHistory.getCurrentLocation().pathname).toBe(
          '/dashboard/mls/033f69d6-fb76-11eb-a8ff-42010a960002'
        )
      })
    })

    it('should not render OH button if user has not access to CRM', async () => {
      const customReduxState = {
        activeTeam: {
          ...MockActiveTeam,
          acl: ['STORE', 'Websites', 'Marketing', 'Admin']
        }
      }

      render(
        <ListingsPageTestProvider customReduxState={customReduxState}>
          <Listings {...routerProps} />
        </ListingsPageTestProvider>
      )

      await waitFor(() => {
        const items = screen.getAllByTestId('table-row')

        expect(getByText(items[0], 'More Actions')).toBeInTheDocument()
      })

      // Open more actions menu
      fireEvent.click(
        getByText(screen.getAllByTestId('table-row')[0], 'More Actions')
      )

      await waitFor(() => {
        expect(
          screen.queryByText('OH Registration Page')
        ).not.toBeInTheDocument()
      })
    })

    it('should not render OH button if user has not access to Marketing', async () => {
      const customReduxState = {
        activeTeam: {
          ...MockActiveTeam,
          acl: ['STORE', 'Websites', 'CRM', 'Admin']
        }
      }

      render(
        <ListingsPageTestProvider customReduxState={customReduxState}>
          <Listings {...routerProps} />
        </ListingsPageTestProvider>
      )

      await waitFor(() => {
        const items = screen.getAllByTestId('table-row')

        expect(getByText(items[0], 'More Actions')).toBeInTheDocument()
      })

      // Open more actions menu
      fireEvent.click(
        getByText(screen.getAllByTestId('table-row')[0], 'More Actions')
      )

      await waitFor(() => {
        expect(
          screen.queryByText('OH Registration Page')
        ).not.toBeInTheDocument()
      })
    })

    it('should open new OH modal when clicking OH registration button, In case of having open house,', async () => {
      render(
        <ListingsPageTestProvider>
          <Listings {...routerProps} />
        </ListingsPageTestProvider>
      )

      await waitFor(() => {
        const items = screen.getAllByTestId('table-row')

        expect(getByText(items[0], 'More Actions')).toBeInTheDocument()
      })

      // Open more actions menu
      fireEvent.click(
        getByText(screen.getAllByTestId('table-row')[0], 'More Actions')
      )

      await waitFor(() => {
        expect(screen.getByText('OH Registration Page')).toBeInTheDocument()
      })

      // Open OH registration button modal
      fireEvent.click(screen.getByText('OH Registration Page'))

      await waitFor(() => {
        // more actions menu should be closed
        expect(
          screen.queryByText('OH Registration Page')
        ).not.toBeInTheDocument()
        // Edit Open House Registration Page modal should be open
        expect(
          screen.getByText('Edit Open House Registration Page')
        ).toBeInTheDocument()
      })
    })

    it('should open new OH modal when clicking OH registration button, In case of not having open house,', async () => {
      render(
        <ListingsPageTestProvider>
          <Listings {...routerProps} />
        </ListingsPageTestProvider>
      )

      await waitFor(() => {
        const items = screen.getAllByTestId('table-row')

        expect(getByText(items[1], 'More Actions')).toBeInTheDocument()
      })

      // Open more actions menu
      fireEvent.click(
        getByText(screen.getAllByTestId('table-row')[1], 'More Actions')
      )

      await waitFor(() => {
        expect(screen.getByText('OH Registration Page')).toBeInTheDocument()
      })

      // Open OH registration button modal
      fireEvent.click(screen.getByText('OH Registration Page'))

      await waitFor(() => {
        // more actions menu should be closed
        expect(
          screen.queryByText('OH Registration Page')
        ).not.toBeInTheDocument()
        // New Open House Registration Page modal should be open
        expect(
          screen.getByText('New Open House Registration Page')
        ).toBeInTheDocument()
      })
    })
  })
})
