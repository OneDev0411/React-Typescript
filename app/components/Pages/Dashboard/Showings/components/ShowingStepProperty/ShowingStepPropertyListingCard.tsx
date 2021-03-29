import React from 'react'

import { Box, Button } from '@material-ui/core'

import ListingCard, {
  Props as ListingCardProps
} from 'components/ListingCards/ListingCard'

export interface ShowingStepPropertyListingCardProps extends ListingCardProps {
  onChange: () => void
  changeLabel: string
}

function ShowingStepPropertyListingCard({
  onChange,
  changeLabel,
  ...otherProps
}: ShowingStepPropertyListingCardProps) {
  return (
    <>
      <ListingCard {...otherProps} />
      <Box mt={2} display="flex" justifyContent="flex-end">
        <Button variant="outlined" size="small" onClick={onChange}>
          {changeLabel}
        </Button>
      </Box>
    </>
  )
}

export default ShowingStepPropertyListingCard
