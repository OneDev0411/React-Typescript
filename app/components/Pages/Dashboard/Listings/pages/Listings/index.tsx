import { WithRouterProps } from 'react-router'

import { Box } from '@material-ui/core'

import PageLayout from '@app/views/components/GlobalPageLayout'
import LoadingContainer from '@app/views/components/LoadingContainer'

import ListingsTabs from './ListingsTabs'
import ListingsList from './ListingsList'
import useListingsTabs from './use-listings-tabs'

type ListingsProps = WithRouterProps<{ brandId?: UUID }, {}>

function Listings({ params }: ListingsProps) {
  const { tabs, value: brandId } = useListingsTabs(params.brandId)

  return (
    <PageLayout position="relative" overflow="hidden">
      <PageLayout.Header title="Listings" />
      <PageLayout.Main>
        {brandId ? (
          <>
            <ListingsTabs tabs={tabs} value={brandId} />
            <ListingsList brandId={brandId} key={brandId} />
          </>
        ) : (
          <Box height="600px">
            <LoadingContainer
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                padding: 0
              }}
            />
          </Box>
        )}
      </PageLayout.Main>
    </PageLayout>
  )
}

export default Listings
