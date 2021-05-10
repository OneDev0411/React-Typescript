import { Box } from '@material-ui/core'

import CardSkeleton from 'components/CardSkeleton'
import ListingCard, {
  Props as ListingCardProps
} from 'components/ListingCards/ListingCard'

import ShowingStepPropertyChangeButton, {
  ShowingStepPropertyChangeButtonProps
} from './ShowingStepPropertyChangeButton'

export interface ShowingStepPropertyListingCardProps
  extends Omit<ListingCardProps, 'listing'> {
  listing: Nullable<ListingCardProps['listing']>
  onChange: ShowingStepPropertyChangeButtonProps['onClick']
  changeLabel?: ShowingStepPropertyChangeButtonProps['label']
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
      <ShowingStepPropertyChangeButton onClick={onChange} label={changeLabel} />
    </>
  )
}

export default ShowingStepPropertyListingCard
