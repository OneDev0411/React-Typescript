import fecha from 'fecha'
import moment from 'moment'

export const getDate = (datetime: Date = new Date()) =>
  new Date(
    datetime.getUTCFullYear(),
    datetime.getUTCMonth(),
    datetime.getUTCDate()
  )

export const getDateDiff = (date1: Date, date2: Date) =>
  date1.getTime() - date2.getTime()

export const formatDate = (
  date: Nullable<Date>,
  format: string = 'MMM D'
): Nullable<string> => {
  if (date === null) {
    return null
  }

  const utcDate = getDate(date)

  if (utcDate.getFullYear() === 1800) {
    return fecha.format(utcDate, 'MMM DD')
  }

  return fecha.format(utcDate, format)
}

export const durationAsDays = (duration: number): number =>
  moment.duration(duration).asDays()
