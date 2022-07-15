import { Button, Divider, makeStyles, Typography } from '@material-ui/core'
import { mdiStar } from '@mdi/js'
import cn from 'classnames'

import { getListingFormattedPrice, getResizeUrl } from '@app/utils/listing'
import { muiIconSizes } from '@app/views/components/SvgIcons/icon-sizes'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import { OVER_LAYER_HEIGHT } from './constants'
import ListingAdjustmentCardSummery from './ListingAdjustmentCardSummery'
import ListingAdjustmentRow from './ListingAdjustmentRow'
import ListingAmenityRow from './ListingAmenityRow'
import { IListingWithAdjustment } from './types'

const PLACEHOLDER_IMAGE = '/static/images/logo--gray.svg'

const useStyles = makeStyles(
  theme => ({
    root: {
      position: 'relative',
      margin: theme.spacing(1, 0),
      display: 'flex',
      flexDirection: 'column',
      flexWrap: 'nowrap',
      alignContent: 'stretch',
      justifyContent: 'space-between',
      alignItems: 'stretch',
      height: '100%',
      overflow: 'hidden'
    },
    container: {
      margin: theme.spacing(2, 0),
      borderRadius: theme.spacing(1),
      border: `1px solid ${theme.palette.divider}`,
      backgroundColor: theme.palette.common.white,
      width: '100%',
      overflow: 'hidden'
    },
    headerContainer: {
      display: 'flex',
      flexDirection: 'column',
      flex: 1
    },
    amenitiesContainer: {
      height: 'auto'
    },
    primary: {
      backgroundColor: theme.palette.grey[100]
    },
    image: {
      objectFit: 'cover',
      objectPosition: 'center',
      width: '100%',
      height: 150
    },
    cardSummery: {
      padding: theme.spacing(2, 2, 1, 2),
      textAlign: 'left'
    },
    subjectProperty: {
      padding: theme.spacing(2),
      display: 'flex',
      alignItems: 'center'
    },
    starIcon: {
      marginRight: theme.spacing(0.5)
    },
    noAdjustment: {
      padding: theme.spacing(2),
      color: theme.palette.grey[400]
    },
    priceContainer: {
      display: 'flex',
      height: 80,
      flexDirection: 'column',
      justifyContent: 'flex-end',
      alignItems: 'flex-end',
      padding: theme.spacing(2),
      marginTop: 'auto'
    },
    beforeAdjustedPrice: {
      fontSize: theme.typography.body3.fontSize,
      fontWeight: theme.typography.body3.fontWeight,
      color: theme.palette.grey[500]
    },
    adjustedPrice: {
      marginTop: theme.spacing(0.5),
      alignItems: 'center',
      display: 'flex'
    },
    adjustedPriceTitle: {
      paddingRight: theme.spacing(0.5),
      color: theme.palette.grey[900]
    },
    adjustedPriceValue: {
      color: theme.palette.grey[900]
    },
    overLayer: {
      background:
        'linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 60%, rgba(255,255,255,1) 100%)',
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: OVER_LAYER_HEIGHT,
      zIndex: 100,
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'center',
      paddingBottom: theme.spacing(2)
    }
  }),
  { name: 'ListingAdjustmentCard' }
)

interface Props {
  listing: IListingWithAdjustment
  isSubjectProperty: boolean
  onOpenAddAdjustmentModal: (id: UUID) => void
  // TODO: This usually should be handled with css position
  // But, I have to hack it this way because position:fixed didn't work inside of Swiper
  overLayerTopPosition: number | string
}

const ListingAdjustmentCard = ({
  listing,
  isSubjectProperty,
  onOpenAddAdjustmentModal,
  overLayerTopPosition
}: Props) => {
  const {
    price,
    adjustments,
    adjusted_price: adjustedPrice,
    cover_image_url: coverImageUrl
  } = listing

  const classes = useStyles()

  const listingPrice = getListingFormattedPrice(price, false)
  const listingAdjustedPrice = adjustedPrice
    ? getListingFormattedPrice(adjustedPrice, false)
    : undefined
  const coverImageURL = coverImageUrl
    ? `${getResizeUrl(coverImageUrl)}?w=160`
    : PLACEHOLDER_IMAGE

  return (
    <div className={classes.root}>
      <div className={classes.overLayer} style={{ top: overLayerTopPosition }}>
        <Button
          variant="text"
          color="secondary"
          onClick={() => {
            onOpenAddAdjustmentModal(listing.id)
          }}
        >
          + Add Adjustments
        </Button>
      </div>
      <div
        className={cn(
          classes.container,
          classes.headerContainer,
          isSubjectProperty && classes.primary
        )}
      >
        <img className={classes.image} alt="listing" src={coverImageURL} />

        <div className={classes.cardSummery}>
          <ListingAdjustmentCardSummery listing={listing} />
        </div>

        <Divider />

        <div>
          {!!adjustments && !isSubjectProperty && (
            <ListingAdjustmentRow adjustments={adjustments} />
          )}
          {!adjustments && !isSubjectProperty && (
            <Typography variant="body1" className={classes.noAdjustment}>
              No adjustments
            </Typography>
          )}
          {isSubjectProperty && (
            <Typography variant="body1" className={classes.subjectProperty}>
              <SvgIcon
                size={muiIconSizes.small}
                path={mdiStar}
                className={classes.starIcon}
              />
              Subject Property
            </Typography>
          )}
        </div>

        <div className={classes.priceContainer}>
          {listingAdjustedPrice && (
            <Typography className={classes.beforeAdjustedPrice} variant="body2">
              Before Adjusted ${listingPrice}
            </Typography>
          )}

          <div className={classes.adjustedPrice}>
            <Typography className={classes.adjustedPriceTitle} variant="body2">
              {listingAdjustedPrice ? 'Adjusted price' : 'List Price'}
            </Typography>
            <Typography
              className={classes.adjustedPriceValue}
              variant="subtitle1"
            >
              ${listingAdjustedPrice ?? listingPrice}
            </Typography>
          </div>
        </div>
      </div>
      <div
        className={cn(
          classes.container,
          classes.amenitiesContainer,
          isSubjectProperty && classes.primary
        )}
      >
        <ListingAmenityRow listing={listing} />
      </div>
    </div>
  )
}

export default ListingAdjustmentCard
