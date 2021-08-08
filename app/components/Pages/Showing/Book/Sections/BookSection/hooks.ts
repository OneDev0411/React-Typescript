import { useState } from 'react'

import { isToday } from 'date-fns'
import { useDeepCompareEffect } from 'react-use'

import { TimeRange } from 'components/TimeSlotPicker/types'
import { getTimeSlotsInRange } from 'components/TimeSlotPicker/utils'
import { getSecondsSinceStartOfDay } from 'utils/date-utils'

import {
  getBookedTimes,
  getDateAvailabilities,
  getDisabledSlotsBetweenAvailabilities,
  getDisabledSlotsByNoticePeriod,
  getPastTimeSlots
} from './utils'

interface UseBookTimeRange {
  availableRanges: TimeRange[]
  defaultSelectedTimeRange?: TimeRange
  unavailableTimes: number[]
}

export function useBookTimeRange(
  showing: IPublicShowing,
  date?: Date
): UseBookTimeRange {
  const [availableRanges, setAvailableRanges] = useState<TimeRange[]>([])
  const [defaultSelectedTimeRange, setDefaultSelectedTimeRange] =
    useState<Optional<TimeRange>>(undefined)
  const [unavailableTimes, setUnavailableTimes] = useState<number[]>([])

  useDeepCompareEffect(() => {
    if (!date) {
      setAvailableRanges([])
      setDefaultSelectedTimeRange(undefined)
      setUnavailableTimes([])

      return
    }

    const weekdayAvailabilities = getDateAvailabilities(showing, date)

    if (weekdayAvailabilities.length === 0) {
      setAvailableRanges([])
      setDefaultSelectedTimeRange(undefined)
      setUnavailableTimes([])

      return
    }

    const ranges: TimeRange[] = weekdayAvailabilities.map(
      ({ availability }) => [availability[0], availability[1]]
    )

    setAvailableRanges(ranges)

    const timeSlots = ranges.flatMap(range =>
      getTimeSlotsInRange(range[0], range[1], showing.duration)
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
    availableRanges,
    defaultSelectedTimeRange,
    unavailableTimes
  }
}
