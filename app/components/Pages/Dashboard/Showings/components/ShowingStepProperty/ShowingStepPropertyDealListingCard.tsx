import React, { useEffect } from 'react'

import useAsync from 'hooks/use-async'

import getListing from 'models/listings/listing/get-listing'

import ShowingStepPropertyListingCard, {
  ShowingStepPropertyListingCardProps
} from './ShowingStepPropertyListingCard'

interface ShowingStepPropertyDealListingCardProps
  extends Omit<ShowingStepPropertyListingCardProps, 'listing'> {
  listing: UUID
}

function ShowingStepPropertyDealListingCard({
  listing,
  ...otherProps
}: ShowingStepPropertyDealListingCardProps) {
  const { run, data } = useAsync<IListing>()

  useEffect(() => {
    run(() => getListing(listing))
  }, [run, listing])

  return <ShowingStepPropertyListingCard listing={data} {...otherProps} />
}

export default ShowingStepPropertyDealListingCard
