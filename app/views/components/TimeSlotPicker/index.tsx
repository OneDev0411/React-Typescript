import { useCallback, useState, useEffect } from 'react'
import { useDeepCompareEffect } from 'react-use'
import { makeStyles } from '@material-ui/core'
import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore, { Navigation, A11y, Mousewheel } from 'swiper'

import TimeCard from './components/TimeCard'

import { getTimeSlotsInRange } from './utils'
import { TimeRange } from './types'

SwiperCore.use([Navigation, A11y, Mousewheel])

const useStyles = makeStyles(
  () => ({
    slide: {
      width: 'auto !important'
    }
  }),
  {
    name: 'TimeSlotPicker'
  }
)

interface Props {
  start: number
  end: number
  duration: number
  active?: TimeRange
  unavailableTimes?: number[]
  onClick: (range: TimeRange) => void
}

export default function TimeSlotPicker({
  start,
  end,
  duration,
  active,
  unavailableTimes = [],
  onClick
}: Props) {
  const classes = useStyles()

  const slots = getTimeSlotsInRange(start, end, duration)
  const [initialSlide, setInitialSlide] = useState<number>(0)
  const [controlledSwiper, setControlledSwiper] = useState<
    Nullable<SwiperCore>
  >(null)

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
    <Swiper
      freeMode
      navigation
      mousewheel
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
  )
}
