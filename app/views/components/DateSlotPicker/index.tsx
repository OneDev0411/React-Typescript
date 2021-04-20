import { useCallback, useState, useEffect } from 'react'
import { useDeepCompareEffect } from 'react-use'
import { makeStyles } from '@material-ui/core'
import { eachDayOfInterval, isSameDay } from 'date-fns'
import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore, { Navigation, A11y } from 'swiper'

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
  const days = eachDayOfInterval({ start, end })
  const [initialSlide, setInitialSlide] = useState<number>(0)
  const [controlledSwiper, setControlledSwiper] = useState<
    Nullable<SwiperCore>
  >(null)

  useDeepCompareEffect(() => {
    if (!active || days.length === 0) {
      setInitialSlide(0)

      return
    }

    const initialSlideIndex = days.findIndex(day => isSameDay(day, active))

    setInitialSlide(initialSlideIndex === -1 ? 0 : initialSlideIndex)
  }, [days, active])

  useEffect(() => {
    if (!controlledSwiper) {
      return
    }

    controlledSwiper.slideTo(initialSlide)
  }, [controlledSwiper, initialSlide])

  const isDateDisabled = useCallback(
    (date: Date) => {
      if (!unavailableDates) {
        return false
      }

      return unavailableDates.some(item => isSameDay(item, date))
    },
    [unavailableDates]
  )

  return (
    <Swiper
      freeMode
      navigation
      onSwiper={setControlledSwiper}
      slidesPerView="auto"
      spaceBetween={16}
    >
      {days.map(day => (
        <SwiperSlide key={day.getTime()} className={classes.slide}>
          <DayCard
            date={day}
            disabled={isDateDisabled(day)}
            isActive={active ? isSameDay(day, active) : undefined}
            onClick={() => onClick(day)}
          />
        </SwiperSlide>
      ))}
    </Swiper>
  )
}
