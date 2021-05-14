import React from 'react'
import {
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Checkbox,
  Button,
  Grid,
  Chip,
  Box,
  fade,
  Theme,
  makeStyles
} from '@material-ui/core'
import { noop } from 'lodash'
import { mdiHeartOutline, mdiHeart } from '@mdi/js'
import pluralize from 'pluralize'

import { getFormattedPrice } from 'models/Deal/helpers/context'
import {
  getListingFeatures,
  getStatusColor,
  isLeaseProperty
} from 'utils/listing'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { muiIconSizes } from 'components/SvgIcons/icon-sizes'

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
      lineHeight: theme.spacing(1)
    },
    statusChip: {
      display: 'flex'
    },
    statusDot: ({ listing }: Props) => ({
      backgroundColor: `#${getStatusColor(listing.status)}`,
      width: theme.spacing(1),
      height: theme.spacing(1),
      borderRadius: '50%',
      display: 'inline-block'
    }),
    iconSmall: {
      // TODO: there should be better ways to handling this.
      // https://stackoverflow.com/questions/63880835
      marginLeft: `${theme.spacing(1)}px !important`
    },
    cardMediaActionContainer: {
      borderRadius: theme.shape.borderRadius,
      backgroundColor: fade(theme.palette.common.white, 0.7),
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 24,
      height: 24
    },
    selectionCheckbox: {
      padding: theme.spacing(0.5)
    },
    likeButton: {
      minWidth: 'auto',
      padding: 0
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
    addressContainer: {
      maxWidth: '100%'
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
   * Hide features of listing to have a minimal card
   */
  hideFeatures?: boolean

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
  onToggleSelection?: () => void

  /**
   * The card heart like state
   *
   * You should explicitly pass `false` value if you want to make the card likeable
   *
   * If you don't pass anything (undefined actually), the card will not be likeable
   */
  liked?: boolean

  /**
   * Like heart button click handler
   *
   * Note that you need to pass `true` or `false` value
   * to `liked` prop in order to use this handler
   */
  onLikeClick?: () => void

  /**
   * The click handler of listing card
   */
  onClick?: () => void
}

export default function ListingCard({
  listing,
  tags,
  hideFeatures = false,
  selected = undefined,
  onToggleSelection = noop,
  liked = undefined,
  onLikeClick = noop,
  onClick
}: Props) {
  const classes = useStyles({ listing })

  const address =
    listing.type === 'compact_listing'
      ? listing.address.street_address
      : listing.property.address.street_address

  const listingFeatures = getListingFeatures(listing)

  // We don't want to pass checkbox onClick to the card itself
  const stopPropagation = (event: React.MouseEvent) => {
    event.stopPropagation()
  }

  const handleLikeClick = (event: React.MouseEvent) => {
    stopPropagation(event)

    onLikeClick()
  }

  const handleToggleSelection = () => {
    onToggleSelection()
  }

  const propertyType =
    listing.type === 'compact_listing'
      ? listing.compact_property.property_type
      : listing.property.property_type

  const shouldShowAcres = propertyType === 'Lots & Acreage'
  const shouldRenderListingFeaturesRow =
    !hideFeatures &&
    Object.keys(listingFeatures).some(key => !!listingFeatures[key])

  return (
    <Card variant="outlined" className={classes.card} onClick={onClick}>
      <CardActionArea>
        <ListingCardMedia listing={listing}>
          <Grid container justify="space-between">
            <Grid item>
              <Grid container item>
                {selected !== undefined && (
                  <Box my={1} ml={1}>
                    <div className={classes.cardMediaActionContainer}>
                      <Checkbox
                        size="small"
                        checked={selected}
                        className={classes.selectionCheckbox}
                        onChange={handleToggleSelection}
                        onClick={stopPropagation}
                      />
                    </div>
                  </Box>
                )}
                {liked !== undefined && (
                  <Box my={1} ml={1}>
                    <div className={classes.cardMediaActionContainer}>
                      <Button
                        variant="text"
                        className={classes.likeButton}
                        onClick={handleLikeClick}
                      >
                        <SvgIcon
                          color="red"
                          size={muiIconSizes.small}
                          path={liked ? mdiHeart : mdiHeartOutline}
                        />
                      </Button>
                    </div>
                  </Box>
                )}
              </Grid>
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
                    classes={{
                      iconSmall: classes.iconSmall
                    }}
                    icon={<Box className={classes.statusDot} />}
                  />
                </Box>
              </Grid>
            </Grid>
            {shouldRenderListingFeaturesRow && (
              <Grid container item alignItems="flex-end">
                {listingFeatures.bedroomCount ? (
                  <Grid item>
                    <Box display="flex" alignItems="center" mr={2}>
                      <Typography className={classes.listingFeature}>
                        {listingFeatures.bedroomCount}{' '}
                      </Typography>
                      <Typography className={classes.listingFeatureValue}>
                        {pluralize('bed', listingFeatures.bedroomCount)}
                      </Typography>
                    </Box>
                  </Grid>
                ) : null}
                {listingFeatures.bathroomCount ? (
                  <Grid item>
                    <Box display="flex" alignItems="center" mr={2}>
                      <Typography className={classes.listingFeature}>
                        {listingFeatures.bathroomCount}{' '}
                      </Typography>
                      <Typography className={classes.listingFeatureValue}>
                        {pluralize('bath', listingFeatures.bathroomCount)}
                      </Typography>
                    </Box>
                  </Grid>
                ) : null}
                {listingFeatures.areaSqft && !shouldShowAcres ? (
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
                ) : null}
                {listingFeatures.lotSizeAreaAcre && shouldShowAcres ? (
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
                ) : null}
              </Grid>
            )}
            {address && (
              <Grid container item alignItems="center">
                <Grid item className={classes.addressContainer}>
                  <Typography
                    noWrap
                    variant="body2"
                    className={classes.address}
                  >
                    {address}
                  </Typography>
                </Grid>
              </Grid>
            )}
          </Grid>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}
