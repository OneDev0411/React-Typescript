import React, { useCallback } from 'react'

import {
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Checkbox,
  Button,
  Grid,
  Chip,
  alpha,
  Theme,
  makeStyles
} from '@material-ui/core'
import { mdiHeartOutline, mdiHeart } from '@mdi/js'
import cn from 'classnames'
import { noop } from 'lodash'
import pluralize from 'pluralize'

import { muiIconSizes } from 'components/SvgIcons/icon-sizes'
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
    statusDot: ({ listing }: ListingCardProps) => ({
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
      backgroundColor: alpha(theme.palette.common.white, 0.7),
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
    cardHighlightRoot: {
      opacity: 0,
      willChange: 'opacity',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      overflow: 'hidden',
      position: 'absolute',
      transition: 'opacity 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
      borderRadius: 'inherit',
      pointerEvents: 'none',
      backgroundColor: 'currentcolor'
    },
    cardHighlightActive: {
      opacity: 0.1
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
    },
    selectionContainer: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
      marginLeft: theme.spacing(1)
    },
    chipsContainer: {
      margin: theme.spacing(1)
    },
    statusContainer: {
      margin: theme.spacing(1),
      textAlign: 'center'
    },
    listingFeatureContainer: {
      display: 'flex',
      alignItems: 'center',
      marginRight: theme.spacing(2)
    }
  }),
  {
    name: 'ListingCard'
  }
)

export interface ListingCardProps {
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
  onToggleSelection?: (listing: IListing | ICompactListing) => void

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
  onLikeClick?: (listing: IListing | ICompactListing) => void

  /**
   * The click handler of listing card
   */
  onClick?: () => void

  /**
   * The card hover state
   */
  hover?: boolean

  /**
   * The card clicked state
   */
  clicked?: boolean

  /**
   * The onMouseEnter / onMouseLeave handler of listing card
   */
  onChangeHoverState?: (id: UUID, hover: boolean) => void
}

export default function ListingCard({
  listing,
  tags,
  clicked = false,
  hover = false,
  hideFeatures = false,
  selected = undefined,
  onToggleSelection = noop,
  onChangeHoverState,
  liked = undefined,
  onLikeClick = noop,
  onClick
}: ListingCardProps) {
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

    onLikeClick(listing)
  }

  const handleToggleSelection = () => {
    onToggleSelection(listing)
  }

  const propertyType =
    listing.type === 'compact_listing'
      ? listing.compact_property.property_type
      : listing.property.property_type

  const shouldShowAcres = propertyType === 'Lots & Acreage'
  const shouldRenderListingFeaturesRow =
    !hideFeatures &&
    Object.keys(listingFeatures).some(key => !!listingFeatures[key])

  const handleChangeHoverState = useCallback(
    (id: UUID, hover: boolean) => {
      if (typeof onChangeHoverState === 'function') {
        onChangeHoverState(id, hover)
      }
    },
    [onChangeHoverState]
  )

  const shouldHighlightCard = hover || clicked

  return (
    <Card
      data-test="card"
      variant="outlined"
      className={classes.card}
      onMouseEnter={() => {
        handleChangeHoverState(listing.id, true)
      }}
      onMouseLeave={() => {
        handleChangeHoverState(listing.id, false)
      }}
      onClick={onClick}
    >
      <CardActionArea component="div">
        <ListingCardMedia imagesURL={listing.gallery_image_urls}>
          <Grid container justifyContent="space-between">
            <Grid item>
              <Grid container item>
                {selected !== undefined && (
                  <Grid className={classes.selectionContainer}>
                    <div className={classes.cardMediaActionContainer}>
                      <Checkbox
                        size="small"
                        checked={selected}
                        className={classes.selectionCheckbox}
                        onChange={handleToggleSelection}
                        onClick={stopPropagation}
                      />
                    </div>
                  </Grid>
                )}
                {liked !== undefined && (
                  <Grid className={classes.selectionContainer}>
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
                  </Grid>
                )}
              </Grid>
            </Grid>
            {tags && (
              <Grid item>
                <Grid className={classes.chipsContainer}>
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
                </Grid>
              </Grid>
            )}
          </Grid>
        </ListingCardMedia>
        <CardContent className={classes.cardContent}>
          <Grid container direction="column" spacing={1}>
            <Grid
              container
              item
              alignItems="center"
              justifyContent="space-between"
            >
              <Grid item>
                <Typography variant="subtitle1">
                  {getFormattedPrice(listing.price, 'currency', 0)}
                  {isLeaseProperty(listing) ? '/mo' : ''}
                </Typography>
              </Grid>
              <Grid item>
                <Grid className={classes.statusContainer}>
                  <Chip
                    label={listing.status}
                    size="small"
                    variant="outlined"
                    classes={{
                      iconSmall: classes.iconSmall
                    }}
                    icon={<Grid className={classes.statusDot} />}
                  />
                </Grid>
              </Grid>
            </Grid>
            {shouldRenderListingFeaturesRow && (
              <Grid container item alignItems="flex-end">
                {listingFeatures.bedroomCount ? (
                  <Grid item>
                    <Grid className={classes.listingFeatureContainer}>
                      <Typography className={classes.listingFeature}>
                        {listingFeatures.bedroomCount}{' '}
                      </Typography>
                      <Typography className={classes.listingFeatureValue}>
                        {pluralize('bed', listingFeatures.bedroomCount)}
                      </Typography>
                    </Grid>
                  </Grid>
                ) : null}
                {listingFeatures.bathroomCount ? (
                  <Grid item>
                    <Grid className={classes.listingFeatureContainer}>
                      <Typography className={classes.listingFeature}>
                        {listingFeatures.bathroomCount}{' '}
                      </Typography>
                      <Typography className={classes.listingFeatureValue}>
                        {pluralize('bath', listingFeatures.bathroomCount)}
                      </Typography>
                    </Grid>
                  </Grid>
                ) : null}
                {listingFeatures.areaSqft && !shouldShowAcres ? (
                  <Grid item>
                    <Grid className={classes.listingFeatureContainer}>
                      <Typography className={classes.listingFeature}>
                        {listingFeatures.areaSqft.toLocaleString()}{' '}
                      </Typography>
                      <Typography className={classes.listingFeatureValue}>
                        ft<sup>2</sup>
                      </Typography>
                    </Grid>
                  </Grid>
                ) : null}
                {listingFeatures.lotSizeAreaAcre && shouldShowAcres ? (
                  <Grid item>
                    <Grid className={classes.listingFeatureContainer}>
                      <Typography
                        variant="subtitle2"
                        className={classes.listingFeature}
                      >
                        {listingFeatures.lotSizeAreaAcre.toLocaleString()}{' '}
                      </Typography>
                      <Typography className={classes.listingFeatureValue}>
                        acres
                      </Typography>
                    </Grid>
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
        <span
          className={cn({
            [classes.cardHighlightRoot]: true,
            [classes.cardHighlightActive]: shouldHighlightCard
          })}
        />
      </CardActionArea>
    </Card>
  )
}
