import {
  eachDayOfInterval,
  isSameDay,
  isToday,
  isPast,
  isAfter,
  addSeconds
} from 'date-fns'

import { setTime } from 'utils/set-time'
import { getWeekdayName } from 'utils/date-utils'

import { getTimeSlotsInRange } from 'components/TimeSlotPicker/utils'

function getEndDateFromStartDate(startDate: string, days: number = 30): Date {
  const date = new Date(startDate)

  date.setDate(date.getDate() + days)

  return date
}

function getBookableStartDate(showing: IPublicShowing): Date {
  const showingStartDate = new Date(showing.start_date)
  const now = new Date()

  return now > showingStartDate ? now : showingStartDate
}

function getBookableEndDate(showing: IPublicShowing): Date {
  return showing.end_date
    ? new Date(showing.end_date)
    : getEndDateFromStartDate(showing.start_date)
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

  const dateWeekdayName = getWeekdayName(date)
  const weekdayAvailability = showing.availabilities.find(
    item => item.weekday === dateWeekdayName
  )

  // No availability for this day
  // It's not a bookable day
  if (!weekdayAvailability) {
    return false
  }

  // No appointments for any day
  // It's a bookable day
  if (!showing.unavailable_times) {
    return true
  }

  const passedDateUnavailableTime = showing.unavailable_times
    .map(item => new Date(item))
    .filter(item => isSameDay(item, date))

  // No appointments for the passed day
  // It's a bookable day
  if (passedDateUnavailableTime.length === 0) {
    return true
  }

  const allPossibleTimeSlots = getTimeSlotsInRange(
    weekdayAvailability.availability[0],
    weekdayAvailability.availability[1],
    showing.duration
  )

  return allPossibleTimeSlots.length > passedDateUnavailableTime.length
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
      ?.map(timeString => new Date(timeString))
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

export function getPastTimeSlots(
  showing: IPublicShowing,
  date: Date = new Date()
): Date[] {
  const timeSlots = getTimeSlots(showing, date)

  return timeSlots.filter(isPast)
}

export function getDisabledSlotsByNoticePeriod(
  showing: IPublicShowing,
  date: Date = new Date()
): Date[] {
  if (!showing.notice_period) {
    return []
  }

  const timeSlots = getTimeSlots(showing, date)
  const dateWithNoticePeriod = addSeconds(date, showing.notice_period * -1)

  return timeSlots.filter(item => isAfter(item, dateWithNoticePeriod))
}
