import React, { useState, useEffect } from 'react'
import { withRouter, WithRouterProps } from 'react-router'

import { CompactPlace, getPlace } from 'models/listings/search/get-place'
import { useLoadingEntities } from 'hooks/use-loading'

import getListing from 'models/listings/listing/get-listing'

import LoadingContainer from 'components/LoadingContainer'

import Layout from '../Layout'
import { ListingWithProposedAgent } from './types'

function Agents(props: WithRouterProps) {
  const [listing, setListing] = useState<Nullable<ListingWithProposedAgent>>(
    null
  )
  const [place, setPlace] = useState<Nullable<CompactPlace>>(null)
  const [
    isLoadingListingAndPlace,
    setIsLoadingListingAndPlace
  ] = useLoadingEntities(listing)

  useEffect(() => {
    async function fetchListingAndPlace() {
      const listingId: Optional<string> = props.location.query.listing

      if (!listingId) {
        setListing(null)
        setPlace(null)
        setIsLoadingListingAndPlace(false)

        return
      }

      try {
        const fetchedListing: ListingWithProposedAgent = await getListing(
          listingId
        )
        const listingPlace = await getPlace(
          fetchedListing.property.address.full_address
        )

        setListing(fetchedListing)
        setPlace(listingPlace)
      } catch (error) {
        console.error('Error fetching listing data')
        setIsLoadingListingAndPlace(false)
      }
    }

    fetchListingAndPlace()
  }, [props.location.query.listing, setIsLoadingListingAndPlace])

  return (
    <Layout>
      <div>
        <pre>List of agents will be here</pre>
        <div>
          {isLoadingListingAndPlace && <LoadingContainer noPaddings />}
          {!isLoadingListingAndPlace && (
            <>
              <pre>{JSON.stringify(listing, null, 2)}</pre>
              <pre>{JSON.stringify(place, null, 2)}</pre>
            </>
          )}
        </div>
      </div>
    </Layout>
  )
}

export default withRouter(Agents)
