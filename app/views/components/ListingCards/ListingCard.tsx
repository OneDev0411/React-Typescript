import React from 'react'
import {
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
  makeStyles,
  Theme
} from '@material-ui/core'

import { getFormattedPrice } from 'models/Deal/helpers/context'

const useStyles = makeStyles(
  (theme: Theme) => ({
    card: {
      width: '100%'
    },
    cardActionArea: {
      padding: theme.spacing(1)
    },
    image: ({ listing }: Props) => ({
      maxHeight: '200px',
      borderRadius: theme.shape.borderRadius,
      backgroundColor: theme.palette.grey[100],
      objectFit: listing.cover_image_url ? 'cover' : 'contain'
    }),
    cardContent: {
      padding: theme.spacing(2, 1)
    }
  }),
  {
    name: 'ListingCard'
  }
)

interface Props {
  /**
   * The listing or compact listing object
   */
  listing: IListing | ICompactListing
  /**
   * The click handler of listing card
   */
  onClick?: () => void
}

export default function ListingCard({ listing, onClick }: Props) {
  const classes = useStyles({ listing })

  const address =
    listing.type === 'compact_listing'
      ? listing.address.street_address
      : listing.property.address.full_address

  return (
    <Card onClick={onClick} variant="outlined" className={classes.card}>
      <CardActionArea className={classes.cardActionArea}>
        <CardMedia
          component="img"
          src={listing.cover_image_url ?? '/static/images/logo--gray.svg'}
          className={classes.image}
        />
        <CardContent className={classes.cardContent}>
          <Typography variant="subtitle1">
            {getFormattedPrice(listing.price, 'currency', 0)}
          </Typography>
          <Typography variant="body2">{address}</Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}
