import { useState } from 'react'
import { useDeepCompareEffect } from 'react-use'

import {
  hasDistance,
  getWeekdayName,
  datesAreOnSameDay,
  getSecondsSinceStartOfDay
} from 'utils/date-utils'
import { setTime } from 'utils/set-time'

import { getTimeSlotsInRange } from 'components/TimeSlotPicker/utils'
import { TimeRange } from 'components/TimeSlotPicker/types'

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

    const weekdayName = getWeekdayName(date)
    const weekdayAvailability = showing.availabilities.find(
      item => item.weekday === weekdayName
    )

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

    const alreadyBookedSlots =
      showing.unavailable_times
        ?.map(timeString => new Date(timeString))
        .filter(item => datesAreOnSameDay(date, item)) ?? []

    const timeSlots = getTimeSlotsInRange(
      availabilityStart,
      availabilityEnd,
      showing.duration
    )
    const timeSlotsDates = timeSlots.map(item => setTime(date, item[0]))

    const now = new Date()

    const pastSlots = timeSlotsDates.filter(item => item < now)

    // Slots not having enough time until notice period
    const disabledSlotsByPolicies = timeSlotsDates.filter(item => {
      return !hasDistance(item, now, showing.notice_period ?? 0)
    })

    const unavailableTimes = [
      ...new Set([
        ...pastSlots.map(getSecondsSinceStartOfDay),
        ...alreadyBookedSlots.map(getSecondsSinceStartOfDay),
        ...disabledSlotsByPolicies.map(getSecondsSinceStartOfDay)
      ])
    ]

    setUnavailableTimes(unavailableTimes)

    const newDefaultSelectedTimeRange: Optional<TimeRange> = timeSlots.find(
      item => !unavailableTimes.includes(item[0])
    )

    console.log({ newDefaultSelectedTimeRange })

    setDefaultSelectedTimeRange(newDefaultSelectedTimeRange)
  }, [date, showing.availabilities])

  console.log({ defaultSelectedTimeRange })

  return {
    startTime,
    endTime,
    defaultSelectedTimeRange,
    unavailableTimes
  }
}
