import { useState } from 'react'
import { useDeepCompareEffect } from 'react-use'

import {
  getWeekdayName,
  datesAreOnSameDay,
  getSecondsSinceStartOfDay
} from 'utils/date-utils'

interface UseBookTimeRange {
  startTime: number
  endTime: number
  unavailableTimes: number[]
}

export function useBookTimeRange(
  showing: IPublicShowing,
  date?: Date
): UseBookTimeRange {
  const [startTime, setStartTime] = useState<number>(0)
  const [endTime, setEndTime] = useState<number>(0)
  const [unavailableTimes, setUnavailableTimes] = useState<number[]>([])

  useDeepCompareEffect(() => {
    if (!date) {
      setStartTime(0)
      setEndTime(0)
      setUnavailableTimes([])

      return
    }

    const weekdayName = getWeekdayName(date)
    const weekdayAvailability = showing.availabilities.find(
      item => item.weekday === weekdayName
    )

    if (!weekdayAvailability) {
      setStartTime(0)
      setEndTime(0)
      setUnavailableTimes([])

      return
    }

    const unavailableDateTimes =
      showing.unavailable_times
        ?.map(timeString => new Date(timeString))
        .filter(item => datesAreOnSameDay(date, item)) ?? []

    const unavailableTimes = [
      ...new Set(unavailableDateTimes.map(getSecondsSinceStartOfDay))
    ]

    setStartTime(weekdayAvailability.availability[0])
    setEndTime(weekdayAvailability.availability[1])
    setUnavailableTimes(unavailableTimes)
  }, [date, showing.availabilities])

  return {
    startTime,
    endTime,
    unavailableTimes
  }
}
