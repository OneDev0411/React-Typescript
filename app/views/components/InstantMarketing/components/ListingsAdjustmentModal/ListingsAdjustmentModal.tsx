import { useState } from 'react'

import { Button, makeStyles, useTheme } from '@material-ui/core'
import { mdiChevronRight, mdiChevronLeft } from '@mdi/js'
import cn from 'classnames'
import { Navigation } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'

import { Modal, ModalHeader, ModalFooter } from 'components/Modal'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'

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
  const [prevEl, setPrevEl] = useState<HTMLElement | null>(null)
  const [nextEl, setNextEl] = useState<HTMLElement | null>(null)
  const theme = useTheme()

  const [adjustments, setAdjustments] = useState<Adjustments>(
    createInitialAdjustments(listings)
  )

  const handleSave = () => {
    onSave(addAdjustmentToListings(listings, adjustments))
  }

  // TODO: remove this line
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onChangeAdjustment = (id: UUID, changedValue: IAdjustment[]) => {
    setAdjustments(oldValues => ({ ...oldValues, [id]: changedValue }))
  }

  return (
    <Modal isOpen autoHeight xLarge>
      <ModalHeader closeHandler={onClose} title="Listings Adjustment" />
      <div className={classes.body}>
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
