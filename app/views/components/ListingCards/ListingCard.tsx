import React from 'react'
import {
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Checkbox,
  Theme,
  Grid,
  Chip,
  Box,
  Badge,
  useTheme,
  makeStyles
} from '@material-ui/core'
import { mdiMapMarkerOutline } from '@mdi/js'
import { noop } from 'lodash'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import { getFormattedPrice } from 'models/Deal/helpers/context'
import {
  getListingFeatures,
  getStatusColor,
  isLeaseProperty
} from 'utils/listing'

import ListingCardMedia from './ListingCardMedia'

const useStyles = makeStyles(
  (theme: Theme) => ({
    card: ({ variant }: Props) => ({
      width: '100%',
      borderColor: variant === 'bare' ? 'transparent' : theme.palette.divider
    }),
    badgeDot: ({ listing }: Props) => ({
      backgroundColor: `#${getStatusColor(listing.status)}`,
      transform: 'none',
      position: 'static'
    }),
    cardActionArea: {
      padding: theme.spacing(1)
    },
    checkboxContainer: {
      borderRadius: theme.shape.borderRadius,
      backgroundColor: theme.palette.common.white
    },
    checkbox: {
      padding: theme.spacing(0.5)
    },
    statusChip: {
      backgroundColor: theme.palette.common.white
    },
    cardContent: {
      padding: theme.spacing(1)
    },
    listingFeature: {
      ...theme.typography.subtitle3
    },
    address: {
      ...theme.typography.body3
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
   * Passing `bare` will set the card border color to transparent
   *
   */
  variant?: 'outlined' | 'bare'

  /**
   * The card checkbox selection state
   *
   * You should explicitly pass `false` value if you want to make the card selectable
   *
   * If you don't pass anything (undefined actually), the card will not be selectable
   */
  selected?: boolean

  /**
   * Selection checkbox toggle handler
   *
   * Note that you need to pass `true` or `false` value
   * to `selected` prop in order to use this handler
   */
  onToggleSelection?: (listing: IListing | ICompactListing) => void
  /**
   * The click handler of listing card
   */
  onClick?: () => void
}

export default function ListingCard({
  listing,
  variant = 'outlined',
  selected = undefined,
  onToggleSelection = noop,
  onClick
}: Props) {
  const theme = useTheme()
  const classes = useStyles({ listing, variant })

  const address =
    listing.type === 'compact_listing'
      ? listing.address.street_address
      : listing.property.address.street_address

  const listingFeatures = getListingFeatures(listing)

  return (
    <Card variant="outlined" className={classes.card} onClick={onClick}>
      <CardActionArea className={classes.cardActionArea}>
        <ListingCardMedia listing={listing}>
          <Grid container justify="space-between">
            <Grid item>
              {selected !== undefined && (
                <Box m={1}>
                  <div className={classes.checkboxContainer}>
                    <Checkbox
                      size="small"
                      checked={selected}
                      className={classes.checkbox}
                      onChange={() => onToggleSelection(listing)}
                      // We don't want to pass checkbox onClick to the card itself
                      onClick={event => event.stopPropagation()}
                    />
                  </div>
                </Box>
              )}
            </Grid>
            <Grid item>
              <Box m={1} textAlign="center">
                <Chip
                  label={listing.status}
                  className={classes.statusChip}
                  icon={
                    <Box flex>
                      <Badge
                        variant="dot"
                        classes={{
                          dot: classes.badgeDot
                        }}
                      />
                    </Box>
                  }
                />
              </Box>
            </Grid>
          </Grid>
        </ListingCardMedia>
        <CardContent className={classes.cardContent}>
          <Grid container direction="column" spacing={1}>
            <Grid container item>
              <Typography variant="subtitle1">
                {getFormattedPrice(listing.price, 'currency', 0)}
                {isLeaseProperty(listing) ? '/mo' : ''}
              </Typography>
            </Grid>
            <Grid container item alignItems="flex-end" spacing={2}>
              <Grid item>
                <Typography
                  variant="subtitle2"
                  className={classes.listingFeature}
                >
                  {listingFeatures.bedroomCount} bd
                </Typography>
              </Grid>
              <Grid item>
                <Typography
                  variant="subtitle2"
                  className={classes.listingFeature}
                >
                  {listingFeatures.bathroomCount} ba
                </Typography>
              </Grid>
              <Grid item>
                <Typography
                  variant="subtitle2"
                  className={classes.listingFeature}
                >
                  {listingFeatures.areaSqft.toLocaleString()} ft<sup>2</sup>
                </Typography>
              </Grid>
              {listingFeatures.lotSizeAreaAcre && (
                <Grid item>
                  <Typography
                    variant="subtitle2"
                    className={classes.listingFeature}
                  >
                    {listingFeatures.lotSizeAreaAcre.toLocaleString()} acres
                  </Typography>
                </Grid>
              )}
            </Grid>
            <Grid container item alignItems="center">
              <Grid item>
                <SvgIcon
                  path={mdiMapMarkerOutline}
                  color={theme.palette.action.active}
                />
              </Grid>

              <Grid item>
                <Typography variant="body2" className={classes.address}>
                  {address}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}
