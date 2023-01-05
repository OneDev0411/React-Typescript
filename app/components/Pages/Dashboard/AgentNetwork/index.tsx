import useBrandAndDealsListings from '@app/hooks/use-brand-and-deals-listings'
import { useNavigate } from '@app/hooks/use-navigate'
import { withRouter } from '@app/routes/with-router'

import { toListingPage, toSearchResultPage } from './helpers'
import Layout from './Layout'
import Info from './Sections/Info'
import Listings from './Sections/Listings'

export function AgentNetwork() {
  const { listings, isLoading } = useBrandAndDealsListings()
  const navigate = useNavigate()
  const OpenListingPage = () => {
    navigate(...toListingPage)
  }

  const OpenSearchResultPage = () => {
    navigate(...toSearchResultPage(listing))
  }

  return (
    <Layout title="Agent Network" onSelectSearchResult={OpenSearchResultPage}>
      <Info />
      <Listings
        isLoading={isLoading}
        listings={listings}
        onSelectListing={OpenListingPage}
      />
    </Layout>
  )
}

export default withRouter(AgentNetwork)
