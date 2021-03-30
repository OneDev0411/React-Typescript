import React from 'react'

import { Box, Button } from '@material-ui/core'

import CardSkeleton from 'components/CardSkeleton'
import ListingCard, {
  Props as ListingCardProps
} from 'components/ListingCards/ListingCard'

export interface ShowingStepPropertyListingCardProps
  extends Omit<ListingCardProps, 'listing'> {
  onChange: () => void
  changeLabel: string
  listing: Nullable<ListingCardProps['listing']>
}

function ShowingStepPropertyListingCard({
  onChange,
  changeLabel,
  listing,
  ...otherProps
}: ShowingStepPropertyListingCardProps) {
  return (
    <>
      <Box maxWidth={340} marginLeft="auto">
        {listing ? (
          <ListingCard {...otherProps} listing={listing} />
        ) : (
          <CardSkeleton />
        )}
      </Box>
      <Box mt={2} display="flex" justifyContent="flex-end">
        <Button variant="outlined" size="small" onClick={onChange}>
          {changeLabel}
        </Button>
      </Box>
    </>
  )
}

export default ShowingStepPropertyListingCard
