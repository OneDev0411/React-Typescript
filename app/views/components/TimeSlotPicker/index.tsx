import { useCallback, useState, useEffect } from 'react'

import { makeStyles } from '@material-ui/core'
import cn from 'classnames'
import { useDeepCompareEffect } from 'react-use'
import SwiperCore, { Navigation, A11y, Mousewheel } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'

import TimeCard from './components/TimeCard'
import { TimeRange } from './types'
import { getTimeSlotsInRange } from './utils'

const useStyles = makeStyles(
  theme => ({
    slide: {
      width: 'auto !important'
    },
    container: {
      position: 'relative'
    },
    swiperButtonPrev: {
      left: `${theme.spacing(-2)}px !important`
    },
    swiperButtonNext: {
      right: `${theme.spacing(-2)}px !important`
    }
  }),
  {
    name: 'TimeSlotPicker'
  }
)

interface Props {
  availableRanges: TimeRange[]
  duration: number
  active?: TimeRange
  unavailableTimes?: number[]
  onClick: (range: TimeRange) => void
}

export default function TimeSlotPicker({
  availableRanges,
  duration,
  active,
  unavailableTimes = [],
  onClick
}: Props) {
  const classes = useStyles()

  const slots = availableRanges.flatMap(([start, end]) =>
    getTimeSlotsInRange(start, end, duration)
  )
  const [initialSlide, setInitialSlide] = useState<number>(0)
  const [controlledSwiper, setControlledSwiper] =
    useState<Nullable<SwiperCore>>(null)

  const isSlotDisabled = useCallback(
    (slot: TimeRange) => {
      return unavailableTimes.includes(slot[0])
    },
    [unavailableTimes]
  )

  useDeepCompareEffect(() => {
    if (!active || slots.length === 0) {
      setInitialSlide(0)

      return
    }

    const initialSlideIndex = slots.findIndex(
      slot =>
        slot[0] === active[0] && slot[1] === active[1] && !isSlotDisabled(slot)
    )

    if (initialSlideIndex === -1) {
      setInitialSlide(0)

      // TODO: change this hack in the future. :(
      onClick(slots[0])

      return
    }

    setInitialSlide(initialSlideIndex)
  }, [slots, active])

  useEffect(() => {
    if (!controlledSwiper) {
      return
    }

    controlledSwiper.slideTo(initialSlide)
  }, [controlledSwiper, initialSlide])

  return (
    <div className={classes.container}>
      <Swiper
        modules={[Navigation, A11y, Mousewheel]}
        freeMode
        mousewheel
        navigation={{
          prevEl: `.${classes.swiperButtonPrev}`,
          nextEl: `.${classes.swiperButtonNext}`
        }}
        onSwiper={setControlledSwiper}
        slidesPerView="auto"
        spaceBetween={16}
      >
        {slots.map(slot => (
          <SwiperSlide key={slot[0]} className={classes.slide}>
            <TimeCard
              time={slot[0]}
              isActive={slot[0] === active?.[0] && slot[1] === active?.[1]}
              disabled={isSlotDisabled(slot)}
              onClick={() => onClick(slot)}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      <div className={cn('swiper-button-prev', classes.swiperButtonPrev)} />
      <div className={cn('swiper-button-next', classes.swiperButtonNext)} />
    </div>
  )
}
