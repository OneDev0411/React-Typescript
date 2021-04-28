import {
  eachDayOfInterval,
  isSameDay,
  isToday,
  isPast,
  isBefore,
  addSeconds,
  addDays,
  addMinutes,
  subMinutes,
  endOfDay
} from 'date-fns'

import { setTime } from 'utils/set-time'
import { getWeekdayName } from 'utils/date-utils'

import { getTimeSlotsInRange } from 'components/TimeSlotPicker/utils'

export function convertLocalTimeToShowingTime(
  showing: IPublicShowing,
  localTime: Date
): Date {
  const sellingAgentTimezoneOffset = showing.timezone_offset
  const currentUserTimezoneOffset = new Date().getTimezoneOffset()

  const offsetDiff = sellingAgentTimezoneOffset - currentUserTimezoneOffset

  return addMinutes(localTime, offsetDiff)
}

export function convertShowingTimeToLocalTime(
  showing: IPublicShowing,
  showingTime: Date
): Date {
  const sellingAgentTimezoneOffset = showing.timezone_offset
  const currentUserTimezoneOffset = new Date().getTimezoneOffset()

  const offsetDiff = sellingAgentTimezoneOffset - currentUserTimezoneOffset

  return subMinutes(showingTime, offsetDiff)
}

function getBookableStartDate(showing: IPublicShowing): Date {
  const showingStartDate = new Date(showing.start_date)
  const now = new Date()

  return now > showingStartDate ? now : showingStartDate
}

function getBookableEndDate(showing: IPublicShowing): Date {
  return showing.end_date
    ? new Date(showing.end_date)
    : addDays(endOfDay(new Date()), 30)
}

export function isShowingBookable(showing: IPublicShowing): boolean {
  const now = new Date()

  const startDate = getBookableStartDate(showing)
  const endDate = getBookableEndDate(showing)

  return startDate <= now && endDate >= now
}

export function isDayBookable(showing: IPublicShowing, date: Date): boolean {
  if (!showing.same_day_allowed && isToday(date)) {
    return false
  }

  const allPossibleTimeSlotsLength = getTimeSlots(showing, date).length

  const pastSlots = isToday(date) ? getPastTimeSlots(showing) : []
  const alreadyBookedSlots = getBookedTimes(showing, date)
  const disabledSlotsByPolicies = isToday(date)
    ? getDisabledSlotsByNoticePeriod(showing)
    : []

  const disabledSlotsLength = new Set([
    ...pastSlots.map(item => item.getTime()),
    ...alreadyBookedSlots.map(item => item.getTime()),
    ...disabledSlotsByPolicies.map(item => item.getTime())
  ]).size

  return allPossibleTimeSlotsLength > disabledSlotsLength
}

interface BookableDateRange {
  startDate: Date
  endDate: Date
  defaultSelectedDate?: Date
  unavailableDates: Date[]
}

export function getBookableDateRange(
  showing: IPublicShowing
): BookableDateRange {
  const startDate = getBookableStartDate(showing)
  const endDate = getBookableEndDate(showing)
  const allPossibleDates = eachDayOfInterval({
    start: startDate,
    end: endDate
  })

  const unavailableDates = allPossibleDates.filter(
    date => !isDayBookable(showing, date)
  )

  const defaultSelectedDate = allPossibleDates.find(date =>
    unavailableDates.every(unavailableDate => !isSameDay(date, unavailableDate))
  )

  return {
    startDate,
    endDate,
    defaultSelectedDate,
    unavailableDates
  }
}

export function getBookedTimes(showing: IPublicShowing, date: Date): Date[] {
  return (
    showing.unavailable_times
      ?.map(timeString =>
        convertShowingTimeToLocalTime(showing, new Date(timeString))
      )
      .filter(item => isSameDay(date, item)) ?? []
  )
}

export function getDateAvailability(
  showing: IPublicShowing,
  date: Date
): IShowingAvailability | undefined {
  const weekdayName = getWeekdayName(date)

  return showing.availabilities.find(item => item.weekday === weekdayName)
}

export function getTimeSlots(showing: IPublicShowing, date: Date): Date[] {
  const dateAvailability = getDateAvailability(showing, date)

  if (!dateAvailability) {
    return []
  }

  const [availabilityStart, availabilityEnd] = dateAvailability.availability

  return getTimeSlotsInRange(
    availabilityStart,
    availabilityEnd,
    showing.duration
  ).map(item => setTime(date, item[0]))
}

export function getPastTimeSlots(showing: IPublicShowing): Date[] {
  const now = new Date()
  const timeSlots = getTimeSlots(showing, now)

  return timeSlots.filter(slot =>
    isPast(convertLocalTimeToShowingTime(showing, slot))
  )
}

export function getDisabledSlotsByNoticePeriod(
  showing: IPublicShowing
): Date[] {
  if (!showing.notice_period) {
    return []
  }

  const now = new Date()

  const timeSlots = getTimeSlots(showing, now)
  const dateWithNoticePeriod = addSeconds(now, showing.notice_period)

  return timeSlots.filter(slot =>
    isBefore(convertLocalTimeToShowingTime(showing, slot), dateWithNoticePeriod)
  )
}
