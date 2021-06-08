import { useState } from 'react'
import { useDeepCompareEffect } from 'react-use'
import { isToday } from 'date-fns'

import { getSecondsSinceStartOfDay } from 'utils/date-utils'

import { getTimeSlotsInRange } from 'components/TimeSlotPicker/utils'
import { TimeRange } from 'components/TimeSlotPicker/types'

import {
  getBookedTimes,
  getDateAvailabilities,
  getDisabledSlotsBetweenAvailabilities,
  getDisabledSlotsByNoticePeriod,
  getPastTimeSlots
} from './utils'

interface UseBookTimeRange {
  startTime: number
  endTime: number
  defaultSelectedTimeRange?: TimeRange
  unavailableTimes: number[]
}

export function useBookTimeRange(
  showing: IPublicShowing,
  date?: Date
): UseBookTimeRange {
  const [startTime, setStartTime] = useState<number>(0)
  const [endTime, setEndTime] = useState<number>(0)
  const [defaultSelectedTimeRange, setDefaultSelectedTimeRange] = useState<
    Optional<TimeRange>
  >(undefined)
  const [unavailableTimes, setUnavailableTimes] = useState<number[]>([])

  useDeepCompareEffect(() => {
    if (!date) {
      setStartTime(0)
      setEndTime(0)
      setDefaultSelectedTimeRange(undefined)
      setUnavailableTimes([])

      return
    }

    const weekdayAvailabilities = getDateAvailabilities(showing, date)

    if (weekdayAvailabilities.length === 0) {
      setStartTime(0)
      setEndTime(0)
      setDefaultSelectedTimeRange(undefined)
      setUnavailableTimes([])

      return
    }

    const availabilityStart = Math.min(
      ...weekdayAvailabilities.map(item => item.availability[0])
    )
    const availabilityEnd = Math.max(
      ...weekdayAvailabilities.map(item => item.availability[1])
    )

    setStartTime(availabilityStart)
    setEndTime(availabilityEnd)

    const timeSlots = weekdayAvailabilities.flatMap(item =>
      getTimeSlotsInRange(
        item.availability[0],
        item.availability[1],
        showing.duration
      )
    )

    const pastSlots = isToday(date) ? getPastTimeSlots(showing) : []
    const alreadyBookedSlots = getBookedTimes(showing, date)
    const disabledSlotsByPolicies = isToday(date)
      ? getDisabledSlotsByNoticePeriod(showing)
      : []

    const sameDaySlotsBetweenRanges = getDisabledSlotsBetweenAvailabilities(
      showing,
      date
    )

    const unavailableTimes = [
      ...new Set([
        ...pastSlots.map(getSecondsSinceStartOfDay),
        ...alreadyBookedSlots.map(getSecondsSinceStartOfDay),
        ...disabledSlotsByPolicies.map(getSecondsSinceStartOfDay),
        ...sameDaySlotsBetweenRanges.map(getSecondsSinceStartOfDay)
      ])
    ]

    setUnavailableTimes(unavailableTimes)

    const newDefaultSelectedTimeRange: Optional<TimeRange> = timeSlots.find(
      item => !unavailableTimes.includes(item[0])
    )

    setDefaultSelectedTimeRange(newDefaultSelectedTimeRange)
  }, [date, showing.availabilities])

  return {
    startTime,
    endTime,
    defaultSelectedTimeRange,
    unavailableTimes
  }
}
