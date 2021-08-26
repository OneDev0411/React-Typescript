import { makeStyles, Chip } from '@material-ui/core'
import cn from 'classnames'

import { toggleListingHoverState } from '../context/actions'
import useListingsContext from '../hooks/useListingsContext'

const useStyles = makeStyles(
  () => ({
    card: {
      backgroundColor: '#eee',
      height: 200,
      borderRadius: 8,
      padding: 10,
      '&.hover, &.selected': {
        backgroundColor: '#ccc',
        cursor: 'pointer',
        boxShadow: '0px 2px 18px -2px rgba(0,0,0,0.1)'
      }
    }
  }),
  { name: 'ListingsCard' }
)

export const Card = ({ listing }) => {
  const classes = useStyles()
  const [, dispatch] = useListingsContext()

  const toggleHoverState = listingId => {
    dispatch(toggleListingHoverState(listingId))
  }

  return (
    <div
      id={listing.id}
      onMouseEnter={() => toggleHoverState(listing.id)}
      onMouseLeave={() => toggleHoverState(listing.id)}
      className={cn(classes.card, {
        hover: listing.hover,
        selected: listing.clicked
      })}
    >
      <h3>
        {listing.address.street_address} <Chip label={`${listing.price}K`} />
      </h3>
    </div>
  )
}
