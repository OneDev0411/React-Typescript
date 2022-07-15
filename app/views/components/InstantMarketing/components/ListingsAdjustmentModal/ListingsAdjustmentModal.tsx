import { useRef, useState, UIEvent } from 'react'

import { Button, makeStyles, useTheme } from '@material-ui/core'
import { mdiChevronRight, mdiChevronLeft } from '@mdi/js'
import cn from 'classnames'
import { Navigation } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'

import { Modal, ModalHeader, ModalFooter } from 'components/Modal'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import { OVER_LAYER_HEIGHT } from './constants'
import { EditAdjustmentModal } from './EditAdjustmentModal'
import { addAdjustmentToListings, createInitialAdjustments } from './helpers'
import ListingAdjustmentCard from './ListingAdjustmentCard'
import { IListingWithAdjustment, Adjustments, IAdjustment } from './types'

interface Props {
  listings: IListing[]
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
  const [editingListing, setEditingListing] = useState<Nullable<UUID>>(null)
  const editingMode = !!editingListing
  const selectedListing = editingMode
    ? listings.find(listing => listing.id === editingListing)
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

  const onChangeAdjustment = (id: UUID, changedValue: IAdjustment[]) => {
    setAdjustments(oldValues => ({ ...oldValues, [id]: changedValue }))
  }

  const onOpenAddAdjustmentModal = (id: UUID) => {
    setEditingListing(id)
  }

  const onCloseEditAdjustmentModal = () => {
    setEditingListing(null)
  }

  // TODO: This usually should be handled with css position
  // But, I have to hack it this way because position:fixed didn't work inside of Swiper
  const handleScroll = (event: UIEvent<HTMLDivElement>) => {
    setOverLayerTopPosition(
      (event.currentTarget.scrollTop || 0) +
        (event.currentTarget.clientHeight || 0) -
        OVER_LAYER_HEIGHT
    )
  }

  if (editingMode && selectedListing) {
    return (
      <EditAdjustmentModal
        listing={selectedListing}
        onChange={onChangeAdjustment}
        onClose={onCloseEditAdjustmentModal}
      />
    )
  }

  return (
    <Modal isOpen autoHeight xLarge>
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
          breakpoints={{
            [theme.breakpoints.values.sm]: {
              slidesPerView: 2,
              spaceBetween: theme.spacing(2)
            },
            [theme.breakpoints.values.md]: {
              slidesPerView: 3,
              spaceBetween: theme.spacing(2)
            },
            [theme.breakpoints.values.lg]: {
              slidesPerView: 3,
              spaceBetween: theme.spacing(4)
            },
            [theme.breakpoints.values.xl]: {
              slidesPerView: 4,
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
                isSubjectProperty={index === 0}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <ModalFooter>
        <Button variant="contained" color="primary" onClick={handleSave}>
          Next
        </Button>
      </ModalFooter>
    </Modal>
  )
}
