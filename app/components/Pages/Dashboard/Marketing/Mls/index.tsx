import { useState, useEffect } from 'react'

// import { WithRouterProps } from 'react-router'
import { useTitle } from 'react-use'

import { useSearchParams } from '@app/hooks/use-search-param'
import getListing from '@app/models/listings/listing/get-listing'
import { WithRouterProps } from '@app/routes/types'
import PageLayout from '@app/views/components/GlobalPageLayout'
import ListingHeader from '@app/views/components/ListingHeader'
import ListingMarketing from '@app/views/components/ListingMarketing'

export default function ListingMarketingPage({
  params,
  location,
  router
}: WithRouterProps) {
  useTitle('Marketing | Rechat')

  const [searchParams] = useSearchParams()
  const listingId: UUID = params.id

  console.log('searchParams.get', searchParams.get('type'))

  const templateType: Optional<Nullable<IMarketingTemplateType | string>> =
    searchParams.get('type')
  const medium: Optional<IMarketingTemplateMedium> =
    (location.hash.split('#').pop() as IMarketingTemplateMedium) || undefined

  const [listing, setListing] = useState<Nullable<IListing>>(null)

  useEffect(() => {
    async function fetchListing() {
      try {
        const listing = await getListing(listingId)

        setListing(listing)
      } catch (error) {
        console.error(error)
      }
    }

    fetchListing()
  }, [listingId])

  if (!listing) {
    return null
  }

  return (
    <PageLayout>
      <PageLayout.Header>
        <ListingHeader title="Listing Marketing" listing={listing} />
      </PageLayout.Header>
      <PageLayout.Main>
        <ListingMarketing
          listing={listing}
          templateType={templateType}
          medium={medium}
          onChangeTemplateType={type => {
            router.push({
              ...location,
              query: {
                ...searchParams.get,
                type
              }
            })
          }}
          onChangeMedium={medium => {
            router.replace({
              ...location,
              hash: `#${medium}`
            })
          }}
        />
      </PageLayout.Main>
    </PageLayout>
  )
}
