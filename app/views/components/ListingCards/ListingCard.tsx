import React from 'react'

import {
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Checkbox,
  Button,
  Grid,
  Chip
} from '@material-ui/core'
import {
  mdiShower,
  mdiBedKingOutline,
  mdiVectorSquare,
  mdiMapMarkerOutline,
  mdiHeartOutline,
  mdiDatabaseOutline,
  mdiHeart
} from '@mdi/js'
import cn from 'classnames'
import { noop } from 'lodash'
import pluralize from 'pluralize'

import { muiIconSizes } from 'components/SvgIcons/icon-sizes'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import {
  getListingFeatures,
  getListingFormattedPrice,
  isLeaseProperty
} from 'utils/listing'

import ListingCardMedia from './ListingCardMedia'
import { useStyles } from './styles'

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
   * The mouse enter handler of listing card root
   */
  onMouseEnter?: React.MouseEventHandler<HTMLDivElement>

  /**
   * The mouse leave handler of listing card root
   */
  onMouseLeave?: React.MouseEventHandler<HTMLDivElement>

  /**
   * The card hover state
   */
  hover?: boolean

  /**
   * The card clicked state
   */
  clicked?: boolean
}

export default function ListingCard({
  listing,
  tags,
  clicked = false,
  hover = false,
  hideFeatures = false,
  selected = undefined,
  onToggleSelection = noop,
  liked = undefined,
  onLikeClick = noop,
  onClick,
  onMouseEnter,
  onMouseLeave
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

  const shouldHighlightCard = hover || clicked

  return (
    <Card
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      data-test="card"
      variant="outlined"
      className={cn({
        [classes.card]: true,
        [classes.cardHighlight]: shouldHighlightCard
      })}
      onClick={onClick}
    >
      <CardActionArea component="div">
        <ListingCardMedia imagesURL={listing.gallery_image_urls}>
          <Grid container justifyContent="space-between">
            <Grid item>
              <Grid container item>
                {liked !== undefined && (
                  <Grid className={classes.selectionContainer}>
                    <div className={classes.cardMediaActionContainer}>
                      <Button
                        variant="text"
                        className={classes.likeButton}
                        onClick={handleLikeClick}
                      >
                        <SvgIcon
                          className={cn({
                            [classes.likeButtonIcon]: true,
                            [classes.likeButtonIconLiked]: liked
                          })}
                          size={muiIconSizes.medium}
                          path={liked ? mdiHeart : mdiHeartOutline}
                        />
                      </Button>
                    </div>
                  </Grid>
                )}
                {selected !== undefined && (
                  <Grid
                    className={cn({
                      [classes.selectionContainer]: true,
                      [classes.selectedCheckboxContainer]: selected
                    })}
                  >
                    <div className={classes.cardMediaActionContainer}>
                      <Checkbox
                        size="medium"
                        checked={selected}
                        color="default"
                        classes={{
                          root: classes.checkboxRoot,
                          checked: classes.checkboxChecked
                        }}
                        onChange={handleToggleSelection}
                        onClick={stopPropagation}
                      />
                    </div>
                  </Grid>
                )}
              </Grid>
            </Grid>
            <Grid className={classes.statusContainer}>
              <Chip
                label={listing.status}
                size="small"
                variant="default"
                classes={{
                  root: classes.statusChip,
                  iconSmall: classes.iconSmall
                }}
                icon={<Grid className={classes.statusDot} />}
              />
            </Grid>
          </Grid>
        </ListingCardMedia>

        <CardContent className={classes.cardContent}>
          {tags && (
            <Grid item className={classes.tagsContainer}>
              {tags.map(tag => (
                <Chip
                  key={tag}
                  label={tag}
                  size="small"
                  className={classes.labelChip}
                />
              ))}
            </Grid>
          )}
          <Grid container direction="column" spacing={2}>
            <Grid
              container
              item
              alignItems="center"
              justifyContent="space-between"
            >
              <Grid item>
                <Typography variant="subtitle1">
                  ${getListingFormattedPrice(listing.price, false)}
                  {isLeaseProperty(listing) ? '/mo' : ''}
                </Typography>
              </Grid>
              <Grid item>
                <Grid
                  className={classes.mlsSource}
                  item
                  title="Listing Provider (MLS) Source"
                >
                  <SvgIcon
                    path={mdiDatabaseOutline}
                    className={classes.mlsSourceIcon}
                  />
                  {listing.mls_display_name}
                </Grid>
              </Grid>
            </Grid>
            {shouldRenderListingFeaturesRow && (
              <Grid className={classes.details} container>
                {listingFeatures.bedroomCount ? (
                  <Grid
                    className={classes.detailItem}
                    item
                    title={pluralize('bed', listingFeatures.bedroomCount)}
                  >
                    <SvgIcon
                      path={mdiBedKingOutline}
                      className={classes.detailItemIcon}
                    />
                    {listingFeatures.bedroomCount}
                  </Grid>
                ) : null}
                {listingFeatures.bathroomCount ? (
                  <Grid
                    className={classes.detailItem}
                    item
                    title={pluralize('bath', listingFeatures.bathroomCount)}
                  >
                    <SvgIcon
                      path={mdiShower}
                      className={classes.detailItemIcon}
                    />
                    {listingFeatures.bathroomCount}
                  </Grid>
                ) : null}
                {listingFeatures.areaSqft && !shouldShowAcres ? (
                  <Grid className={classes.detailItem} item title="area">
                    <SvgIcon
                      path={mdiVectorSquare}
                      className={classes.detailItemIcon}
                    />
                    {listingFeatures.areaSqft.toLocaleString()} ft
                    <sup>2</sup>
                  </Grid>
                ) : null}
                {listingFeatures.lotSizeAreaAcre && shouldShowAcres ? (
                  <Grid className={classes.detailItem} item title="acres">
                    <SvgIcon
                      path={mdiVectorSquare}
                      className={classes.detailItemIcon}
                    />
                    {listingFeatures.lotSizeAreaAcre.toLocaleString()} acres
                  </Grid>
                ) : null}
              </Grid>
            )}
            {address && (
              <Grid container item alignItems="center" title="Address">
                <Grid item className={classes.addressContainer}>
                  <Typography variant="body2" className={classes.address}>
                    <SvgIcon
                      path={mdiMapMarkerOutline}
                      className={classes.addressIcon}
                    />
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
