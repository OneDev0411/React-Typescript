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
import { mdiHeartOutline, mdiHeart } from '@mdi/js'
import cn from 'classnames'
import { noop } from 'lodash'
import pluralize from 'pluralize'

import { muiIconSizes } from 'components/SvgIcons/icon-sizes'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { getFormattedPrice } from 'models/Deal/helpers/context'
import { getListingFeatures, isLeaseProperty } from 'utils/listing'

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

  const shouldHighlightCard = hover || clicked

  return (
    <Card
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
              <Grid>
                {tags.map(tag => (
                  <Chip
                    key={tag}
                    label={tag}
                    size="small"
                    className={classes.labelChip}
                  />
                ))}
              </Grid>
            </Grid>
          )}
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
              <Grid item>{/* // TODO: Add listing MLS name */}</Grid>
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
      </CardActionArea>
    </Card>
  )
}
