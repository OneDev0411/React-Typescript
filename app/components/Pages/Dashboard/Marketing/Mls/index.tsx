import { useState, useEffect } from 'react'

import { useTitle } from 'react-use'

import { useNavigate } from '@app/hooks/use-navigate'
import { useSearchParams } from '@app/hooks/use-search-param'
import getListing from '@app/models/listings/listing/get-listing'
import { WithRouterProps } from '@app/routes/types'
import { withRouter } from '@app/routes/with-router'
import PageLayout from '@app/views/components/GlobalPageLayout'
import ListingHeader from '@app/views/components/ListingHeader'
import ListingMarketing from '@app/views/components/ListingMarketing'

function ListingMarketingPage({ params, location, router }: WithRouterProps) {
  useTitle('Marketing | Rechat')

  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const listingId: UUID = params.id

  const templateType: Nullable<IMarketingTemplateType> = searchParams.get(
    'type'
  ) as IMarketingTemplateType
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
            const navParams = new URLSearchParams({
              type: type.toString()
            })

            navigate({ ...location, search: navParams.toString() })
          }}
          onChangeMedium={medium => {
            navigate(
              {
                ...location,
                hash: `#${medium}`
              },
              { replace: true }
            )
          }}
        />
      </PageLayout.Main>
    </PageLayout>
  )
}

export default withRouter(ListingMarketingPage)
