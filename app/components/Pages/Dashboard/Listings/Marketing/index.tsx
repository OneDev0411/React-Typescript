import { useState, useEffect } from 'react'
import { WithRouterProps } from 'react-router'
import { useTitle } from 'react-use'

import ListingMarketing from '@app/views/components/ListingMarketing'
import PageLayout from '@app/views/components/GlobalPageLayout'
import ListingHeader from '@app/views/components/ListingHeader'

import getListing from '@app/models/listings/listing/get-listing'

export default function ListingMarketingPage({
  params,
  location,
  router
}: WithRouterProps) {
  useTitle('Marketing | Rechat')

  const listingId: UUID = params.id
  const templateType: Optional<IMarketingTemplateType> = location.query.type
  const medium: Optional<string> = location.hash.split('#').pop() || undefined

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
          medium={medium as IMarketingTemplateMedium}
          onChangeTemplateType={type => {
            router.push({
              ...location,
              query: {
                ...location.query,
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
