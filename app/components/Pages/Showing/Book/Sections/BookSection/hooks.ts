import { useState } from 'react'
import { useDeepCompareEffect } from 'react-use'
import { isToday } from 'date-fns'

import { getSecondsSinceStartOfDay } from 'utils/date-utils'

import { getTimeSlotsInRange } from 'components/TimeSlotPicker/utils'
import { TimeRange } from 'components/TimeSlotPicker/types'

import {
  getBookedTimes,
  getDateAvailability,
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

    const weekdayAvailability = getDateAvailability(showing, date)

    if (!weekdayAvailability) {
      setStartTime(0)
      setEndTime(0)
      setDefaultSelectedTimeRange(undefined)
      setUnavailableTimes([])

      return
    }

    const [
      availabilityStart,
      availabilityEnd
    ] = weekdayAvailability.availability

    setStartTime(availabilityStart)
    setEndTime(availabilityEnd)

    const timeSlots = getTimeSlotsInRange(
      availabilityStart,
      availabilityEnd,
      showing.duration
    )

    const pastSlots = isToday(date) ? getPastTimeSlots(showing) : []
    const alreadyBookedSlots = getBookedTimes(showing, date)
    const disabledSlotsByPolicies = isToday(date)
      ? getDisabledSlotsByNoticePeriod(showing)
      : []

    const unavailableTimes = [
      ...new Set([
        ...pastSlots.map(slot => getSecondsSinceStartOfDay(slot)),
        ...alreadyBookedSlots.map(slot => getSecondsSinceStartOfDay(slot)),
        ...disabledSlotsByPolicies.map(slot => getSecondsSinceStartOfDay(slot))
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
