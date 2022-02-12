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

  return fecha.format(getDate(date), format)
}

export const durationAsDays = (duration: number): number =>
  moment.duration(duration).asDays()
