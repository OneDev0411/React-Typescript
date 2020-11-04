import React from 'react'
import {
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
  makeStyles,
  Theme,
  Grid,
  Chip,
  Box,
  Badge
} from '@material-ui/core'

import { getFormattedPrice } from 'models/Deal/helpers/context'

const useStyles = makeStyles(
  (theme: Theme) => ({
    card: ({ variant }: Props) => ({
      width: '100%',
      borderColor: variant === 'bare' ? 'transparent' : theme.palette.divider
    }),
    badgeRoot: {
      display: 'flex',
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center'
    },
    badgeDot: {
      top: 0,
      right: 0,
      transform: 'none',
      position: 'static'
    },
    cardActionArea: {
      padding: theme.spacing(1)
    },
    media: ({ listing }: Props) => ({
      height: '200px',
      borderRadius: theme.shape.borderRadius,
      backgroundColor: theme.palette.grey[100],
      backgroundSize: listing.cover_image_url ? 'cover' : 'contain'
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
   * Card variant
   *
   * You can pass `bare` for using in more complex scenarios like grids
   *
   */
  variant?: 'bordered' | 'bare'
  /**
   * The click handler of listing card
   */
  onClick?: () => void
}

export default function ListingCard({
  listing,
  variant = 'bordered',
  onClick
}: Props) {
  const classes = useStyles({ listing, variant })

  const address =
    listing.type === 'compact_listing'
      ? listing.address.street_address
      : listing.property.address.full_address

  return (
    <Card variant="outlined" className={classes.card} onClick={onClick}>
      <CardActionArea className={classes.cardActionArea}>
        <CardMedia
          component="div"
          image={listing.cover_image_url ?? '/static/images/logo--gray.svg'}
          className={classes.media}
        >
          <Grid container justify="flex-end">
            <Grid item>
              <Box m={1}>
                <Chip
                  label={listing.status}
                  avatar={
                    <Box flex>
                      <Badge
                        variant="dot"
                        color="primary"
                        classes={{
                          root: classes.badgeRoot,
                          dot: classes.badgeDot
                        }}
                      />
                    </Box>
                  }
                />
              </Box>
            </Grid>
          </Grid>
        </CardMedia>
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
