import { useRef, useState, UIEvent } from 'react'

import { Button, makeStyles, useTheme } from '@material-ui/core'
import { mdiChevronRight, mdiChevronLeft } from '@mdi/js'
import cn from 'classnames'
import { Navigation } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'

import { Modal, ModalHeader, ModalFooter } from 'components/Modal'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import {
  OVER_LAYER_HEIGHT,
  XL_MAX_SLIDER_ITEMS_COUNT,
  LG_MAX_SLIDER_ITEMS_COUNT
} from './constants'
import { addAdjustmentToListings, createInitialAdjustments } from './helpers'
import ListingAdjustmentCard from './ListingAdjustmentCard'
import { ListingAdjustmentEditModal } from './ListingAdjustmentEditModal'
import { IListingWithAdjustment, Adjustments, IAdjustment } from './types'

interface Props {
  listings: IListingWithAdjustment[]
  onSave: (listings: IListingWithAdjustment[]) => void
  onClose: () => void
}

const useStyles = makeStyles(
  theme => ({
    swiper: {
      width: '100%',
      '& .swiper-slide': {
        height: 'auto'
      }
    },
    body: {
      position: 'relative',
      padding: theme.spacing(0, 10),
      overflowY: 'scroll',
      height: '75vh'
    },
    img: {
      width: '100%'
    },
    sliderButton: {
      width: 32,
      height: 32,
      minWidth: 32,
      borderRadius: theme.spacing(1),
      position: 'absolute',
      top: '30%',
      padding: 3,
      background: 'transparent',
      '&:$disabled': {
        borderColor: theme.palette.grey[300]
      },
      '&:$disabled:hover': {
        background: 'transparent'
      },
      '&:$disabled $buttonIcon': {
        color: theme.palette.grey[300]
      }
    },
    buttonPrev: {
      left: theme.spacing(3.5)
    },
    buttonNext: {
      right: theme.spacing(3.5)
    },
    buttonIcon: { color: theme.palette.grey[500] }
  }),
  { name: 'ListingsAdjustmentModal' }
)

export function ListingsAdjustmentModal({ listings, onSave, onClose }: Props) {
  const classes = useStyles()
  const bodyRef = useRef<HTMLDivElement>(null)
  const [overLayerTopPosition, setOverLayerTopPosition] = useState<
    string | number | undefined
  >()

  const [editingListingId, setEditingListing] = useState<Nullable<UUID>>(null)
  const editingMode = !!editingListingId
  const selectedListing = editingMode
    ? listings.find(listing => listing.id === editingListingId)
    : null
  const [prevEl, setPrevEl] = useState<HTMLElement | null>(null)
  const [nextEl, setNextEl] = useState<HTMLElement | null>(null)
  const theme = useTheme()

  const [adjustments, setAdjustments] = useState<Adjustments>(
    createInitialAdjustments(listings)
  )

  const handleSave = () => {
    onSave(addAdjustmentToListings(listings, adjustments))
  }

  const onOpenAddAdjustmentModal = (id: UUID) => {
    setEditingListing(id)
  }

  const onCloseEditAdjustmentModal = () => {
    setEditingListing(null)
  }

  const onChangeAdjustment = (id: UUID, changedValue: IAdjustment[]) => {
    setAdjustments(oldValues => ({ ...oldValues, [id]: changedValue }))
    onCloseEditAdjustmentModal()
  }

  // This usually should be handled with css position but due to a technical limitation
  // I have to hack it this way because position:fixed didn't work inside of Swiper
  const handleScroll = (event: UIEvent<HTMLDivElement>) => {
    setOverLayerTopPosition(
      (event.currentTarget.scrollTop || 0) +
        (event.currentTarget.clientHeight || 0) -
        OVER_LAYER_HEIGHT
    )
  }

  if (editingMode && selectedListing) {
    return (
      <ListingAdjustmentEditModal
        listing={selectedListing}
        adjustments={adjustments[editingListingId]}
        onChange={onChangeAdjustment}
        onClose={onCloseEditAdjustmentModal}
      />
    )
  }

  return (
    <Modal
      isOpen
      autoHeight
      xLarge={listings.length > XL_MAX_SLIDER_ITEMS_COUNT - 1}
      large={listings.length > 1 && listings.length < XL_MAX_SLIDER_ITEMS_COUNT}
    >
      <ModalHeader closeHandler={onClose} title="Listings Adjustment" />
      <div className={classes.body} ref={bodyRef} onScroll={handleScroll}>
        <Button
          variant="outlined"
          className={cn(classes.buttonPrev, classes.sliderButton)}
          ref={node => setPrevEl(node)}
          type="button"
        >
          <SvgIcon className={classes.buttonIcon} path={mdiChevronLeft} />
        </Button>
        <Button
          variant="outlined"
          className={cn(classes.buttonNext, classes.sliderButton)}
          ref={node => setNextEl(node)}
          type="button"
        >
          <SvgIcon className={classes.buttonIcon} path={mdiChevronRight} />
        </Button>
        <Swiper
          modules={[Navigation]}
          className={classes.swiper}
          navigation={{ prevEl, nextEl }}
          slidesPerView={1}
          spaceBetween={theme.spacing(1)}
          centerInsufficientSlides
          breakpoints={{
            [theme.breakpoints.values.sm]: {
              slidesPerView: 2,
              spaceBetween: theme.spacing(2)
            },
            [theme.breakpoints.values.md]: {
              slidesPerView:
                listings.length >= LG_MAX_SLIDER_ITEMS_COUNT
                  ? LG_MAX_SLIDER_ITEMS_COUNT
                  : listings.length,
              spaceBetween: theme.spacing(2)
            },
            [theme.breakpoints.values.lg]: {
              slidesPerView:
                listings.length >= LG_MAX_SLIDER_ITEMS_COUNT
                  ? LG_MAX_SLIDER_ITEMS_COUNT
                  : listings.length,
              spaceBetween: theme.spacing(4)
            },
            [theme.breakpoints.values.xl]: {
              slidesPerView:
                listings.length >= XL_MAX_SLIDER_ITEMS_COUNT
                  ? XL_MAX_SLIDER_ITEMS_COUNT
                  : listings.length,
              spaceBetween: theme.spacing(4)
            }
          }}
        >
          {listings.map((listing, index) => (
            <SwiperSlide key={listing.id}>
              <ListingAdjustmentCard
                onOpenAddAdjustmentModal={onOpenAddAdjustmentModal}
                overLayerTopPosition={
                  overLayerTopPosition ??
                  (bodyRef.current?.clientHeight || 0) - OVER_LAYER_HEIGHT
                }
                listing={listing}
                adjustments={adjustments[listing.id]}
                isSubjectProperty={index === 0}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <ModalFooter>
        <Button variant="outlined" color="default" onClick={handleSave}>
          Next
        </Button>
      </ModalFooter>
    </Modal>
  )
}
