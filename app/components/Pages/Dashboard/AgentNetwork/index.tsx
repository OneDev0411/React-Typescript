import useBrandAndDealsListings from '@app/hooks/use-brand-and-deals-listings'
import { useNavigate } from '@app/hooks/use-navigate'
import { withRouter } from '@app/routes/with-router'
import { SearchResult } from '@app/views/components/DealsAndListingsAndPlacesSearchInput/types'

import { toListingPage, toPlacePage } from './helpers'
import Layout from './Layout'
import Info from './Sections/Info'
import Listings from './Sections/Listings'

export function AgentNetwork() {
  const { listings, isLoading } = useBrandAndDealsListings()
  const navigate = useNavigate()

  const openListingPage = (listing: ICompactListing | IListing) => {
    navigate(...toListingPage(listing))
  }

  const openSearchResultPage = (result: SearchResult) => {
    if (result.type === 'listing') {
      navigate(...toListingPage(result.listing))
    }

    if (result.type === 'location') {
      navigate(...toPlacePage(result.location))
    }
  }

  return (
    <Layout title="Agent Network" onSelectSearchResult={openSearchResultPage}>
      <Info />
      <Listings
        isLoading={isLoading}
        listings={listings}
        onSelectListing={openListingPage}
      />
    </Layout>
  )
}

export default withRouter(AgentNetwork)
