import { useCallback, useState, useEffect } from 'react'

import { makeStyles } from '@material-ui/core'
import cn from 'classnames'
import { eachDayOfInterval, isSameDay } from 'date-fns'
import { useDeepCompareEffect } from 'react-use'
import SwiperCore, { Navigation, A11y, Mousewheel } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'

import DayCard from './components/DayCard'

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
  const [controlledSwiper, setControlledSwiper] =
    useState<Nullable<SwiperCore>>(null)

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

      <div className={cn('swiper-button-prev', classes.swiperButtonPrev)} />
      <div className={cn('swiper-button-next', classes.swiperButtonNext)} />
    </div>
  )
}
