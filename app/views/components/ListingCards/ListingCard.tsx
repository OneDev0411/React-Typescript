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
  makeStyles
} from '@material-ui/core'
import { noop } from 'lodash'

import { getFormattedPrice } from 'models/Deal/helpers/context'
import {
  getListingFeatures,
  getStatusColor,
  isLeaseProperty
} from 'utils/listing'

import ListingCardMedia from './ListingCardMedia'

const useStyles = makeStyles(
  (theme: Theme) => ({
    card: {
      width: '100%'
    },
    labelChip: {
      backgroundColor: theme.palette.common.white,
      marginLeft: theme.spacing(0.5)
    },
    labelChipLabel: {
      lineHeight: 1
    },
    statusChip: {
      display: 'flex'
    },
    statusBadgeDot: ({ listing }: Props) => ({
      backgroundColor: `#${getStatusColor(listing.status)}`,
      transform: 'none',
      position: 'static'
    }),
    checkboxContainer: {
      borderRadius: theme.shape.borderRadius,
      backgroundColor: theme.palette.common.white
    },
    checkbox: {
      padding: theme.spacing(0.5)
    },
    cardContent: {
      padding: theme.spacing(1)
    },
    listingFeature: {
      ...theme.typography.subtitle3,
      marginRight: theme.spacing(0.5)
    },
    listingFeatureValue: {
      ...theme.typography.body3
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
   * Shows the passed items in separate chips at the top right of the listing card
   */
  tags?: string[]

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
  tags,
  selected = undefined,
  onToggleSelection = noop,
  onClick
}: Props) {
  const classes = useStyles({ listing })

  const address =
    listing.type === 'compact_listing'
      ? listing.address.street_address
      : listing.property.address.street_address

  const listingFeatures = getListingFeatures(listing)

  return (
    <Card variant="outlined" className={classes.card} onClick={onClick}>
      <CardActionArea>
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
            {tags && (
              <Grid item>
                <Box m={1}>
                  {tags.map(tag => (
                    <Chip
                      key={tag}
                      label={tag}
                      size="small"
                      variant="outlined"
                      classes={{
                        root: classes.labelChip,
                        label: classes.labelChipLabel
                      }}
                    />
                  ))}
                </Box>
              </Grid>
            )}
          </Grid>
        </ListingCardMedia>
        <CardContent className={classes.cardContent}>
          <Grid container direction="column" spacing={1}>
            <Grid container item alignItems="center" justify="space-between">
              <Grid item>
                <Typography variant="subtitle1">
                  {getFormattedPrice(listing.price, 'currency', 0)}
                  {isLeaseProperty(listing) ? '/mo' : ''}
                </Typography>
              </Grid>
              <Grid item>
                <Box m={1} textAlign="center">
                  <Chip
                    label={listing.status}
                    size="small"
                    variant="outlined"
                    className={classes.statusChip}
                    icon={
                      <Box flex>
                        <Badge
                          variant="dot"
                          classes={{
                            dot: classes.statusBadgeDot
                          }}
                        />
                      </Box>
                    }
                  />
                </Box>
              </Grid>
            </Grid>
            <Grid container item alignItems="flex-end">
              <Grid item>
                <Box display="flex" alignItems="center" mr={2}>
                  <Typography className={classes.listingFeature}>
                    {listingFeatures.bedroomCount}{' '}
                  </Typography>
                  <Typography className={classes.listingFeatureValue}>
                    bd
                  </Typography>
                </Box>
              </Grid>
              <Grid item>
                <Box display="flex" alignItems="center" mr={2}>
                  <Typography className={classes.listingFeature}>
                    {listingFeatures.bathroomCount}{' '}
                  </Typography>
                  <Typography className={classes.listingFeatureValue}>
                    ba
                  </Typography>
                </Box>
              </Grid>
              <Grid item>
                <Box display="flex" alignItems="center" mr={2}>
                  <Typography className={classes.listingFeature}>
                    {listingFeatures.areaSqft.toLocaleString()}{' '}
                  </Typography>
                  <Typography className={classes.listingFeatureValue}>
                    ft<sup>2</sup>
                  </Typography>
                </Box>
              </Grid>
              {listingFeatures.lotSizeAreaAcre && (
                <Grid item>
                  <Box display="flex" alignItems="center" mr={2}>
                    <Typography
                      variant="subtitle2"
                      className={classes.listingFeature}
                    >
                      {listingFeatures.lotSizeAreaAcre.toLocaleString()}{' '}
                    </Typography>
                    <Typography className={classes.listingFeatureValue}>
                      acres
                    </Typography>
                  </Box>
                </Grid>
              )}
            </Grid>
            <Grid container item alignItems="center">
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
