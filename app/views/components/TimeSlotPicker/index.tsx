import { useCallback } from 'react'
import { makeStyles } from '@material-ui/core'
import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore, { Navigation, A11y } from 'swiper'

import TimeCard from './components/TimeCard'

import { getTimeSlotsInRange } from './utils'

import { TimeRange } from './types'

SwiperCore.use([Navigation, A11y])

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

  const isSlotDisabled = useCallback(
    (slot: TimeRange) => {
      return unavailableTimes.includes(slot[0])
    },
    [unavailableTimes]
  )

  return (
    <Swiper freeMode navigation slidesPerView="auto" spaceBetween={16}>
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
