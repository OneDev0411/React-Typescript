import {
  datesAreOnSameDay,
  getDaysBetween,
  getWeekdayName
} from 'utils/date-utils'
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
    .filter(item => datesAreOnSameDay(item, date))

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
  unavailableDates: Date[]
}

export function getBookableDateRange(
  showing: IPublicShowing
): BookableDateRange {
  const startDate = getBookableStartDate(showing)
  const endDate = getBookableEndDate(showing)
  const allPossibleDates = getDaysBetween(startDate, endDate)

  const unavailableDates = allPossibleDates.filter(
    date => !isDayBookable(showing, date)
  )

  return {
    startDate,
    endDate,
    unavailableDates
  }
}
