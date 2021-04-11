import { useCallback } from 'react'
import { makeStyles } from '@material-ui/core'
import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore, { Navigation, A11y } from 'swiper'

import { getDaysBetween, datesAreOnSameDay } from 'utils/date-utils'

import DayCard from './components/DayCard'

SwiperCore.use([Navigation, A11y])

const useStyles = makeStyles(
  () => ({
    slide: {
      width: 'auto !important'
    }
  }),
  {
    name: 'DateSlotPicker'
  }
)

interface Props {
  start: Date
  end: Date
  active?: Date
  unavailableDates?: Date[]
  onClick: (date: Date) => void
}

export default function DateSlotPicker({
  start,
  end,
  active,
  unavailableDates,
  onClick
}: Props) {
  const classes = useStyles()
  const days = getDaysBetween(start, end)

  const isDateDisabled = useCallback(
    (date: Date) => {
      if (!unavailableDates) {
        return false
      }

      return unavailableDates.some(item => datesAreOnSameDay(item, date))
    },
    [unavailableDates]
  )

  return (
    <Swiper freeMode navigation slidesPerView="auto" spaceBetween={16}>
      {days.map(day => (
        <SwiperSlide key={day.getTime()} className={classes.slide}>
          <DayCard
            date={day}
            disabled={isDateDisabled(day)}
            isActive={active ? datesAreOnSameDay(day, active) : undefined}
            onClick={() => onClick(day)}
          />
        </SwiperSlide>
      ))}
    </Swiper>
  )
}
