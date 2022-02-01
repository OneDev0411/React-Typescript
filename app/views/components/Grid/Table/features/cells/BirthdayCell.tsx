import { memo, useMemo } from 'react'

import { makeStyles } from '@material-ui/core'
import cn from 'classnames'
import fecha from 'fecha'
import moment from 'moment'

import { CellProps } from '../../types'

import CellContainer from './CellContainer'

const useStyles = makeStyles(
  theme => ({
    dateDiffValue: {
      ...theme.typography.body3,
      letterSpacing: '0.4px',
      lineHeight: `${theme.spacing(3)}px`,
      color: theme.palette.grey['500'],
      '&.selected': {
        color: theme.palette.tertiary.dark
      },
      '&.rowSelected': {
        color: theme.palette.tertiary.dark
      },
      '> .isToday': {
        ...theme.typography.button,
        color: theme.palette.primary.main
      }
    },
    dateValue: {
      ...theme.typography.body2,
      color: theme.palette.grey[700],
      letterSpacing: '0.15px',
      lineHeight: `${theme.spacing(3)}px`,
      '&.hovered': {
        color: theme.palette.tertiary.dark
      },
      '&.selected': {
        color: theme.palette.tertiary.dark
      },
      '&.rowSelected': {
        color: theme.palette.tertiary.dark
      }
    }
  }),
  { name: 'Birthday-cell' }
)

//--

const getDate = (datetime: Date = new Date()) =>
  new Date(
    datetime.getUTCFullYear(),
    datetime.getUTCMonth(),
    datetime.getUTCDate()
  )

const getDateDiff = (date1: Date, date2: Date) =>
  date1.getTime() - date2.getTime()

const formatDate = (date: Date, format: string = 'MMM D'): string => {
  const utcDate = getDate(date)

  if (utcDate.getFullYear() === 1800) {
    return fecha.format(utcDate, 'MMM DD')
  }

  return fecha.format(utcDate, format)
}

const birthdayThisYear = (bithday: Date): Date =>
  new Date(
    new Date().getUTCFullYear(),
    bithday.getUTCMonth(),
    bithday.getUTCDate()
  )

const birthdayNextYear = (bithday: Date): Date =>
  new Date(
    new Date().getUTCFullYear() + 1,
    bithday.getUTCMonth(),
    bithday.getUTCDate()
  )

const durationAsDays = (duration: number): number =>
  moment.duration(duration).asDays()

const getDateOfBirth = contact => {
  let date

  contact.attributes?.filter(attr => {
    if (!attr.is_partner && attr.attribute_type === 'birthday') {
      date = new Date(attr.date * 1000)

      return true
    }

    return false
  })

  return date
}

const daysToNextBirthday = (birthday, today) => {
  if (!birthday) {
    return -1
  }

  let dateDiff: number = getDateDiff(birthdayThisYear(birthday), today)

  // if bday is in the future
  if (dateDiff >= 0) {
    return durationAsDays(dateDiff)
  }

  dateDiff = getDateDiff(birthdayNextYear(birthday), today)

  return durationAsDays(dateDiff)
}

//--

interface Props {
  contact: IContact
  onSave?: (e: any) => void
  isRowSelected?: boolean
}

const BirthdayCell = ({ contact, isRowSelected = false }: Props) => {
  const classes = useStyles()

  const today: Date = useMemo(getDate, [])
  const birthday: Date = useMemo(() => getDateOfBirth(contact), [contact])
  const daysToBirthday = useMemo(
    () => daysToNextBirthday(birthday, today),
    [today, birthday]
  )
  const inputFormattedDate: string = useMemo(
    () => formatDate(birthday),
    [birthday]
  )

  const renderCellContent = ({
    isHovered = false,
    isSelected = false
  }: CellProps) => (
    <>
      {!!inputFormattedDate && (
        <div
          className={cn(classes.dateValue, {
            hovered: isHovered,
            selected: isSelected
          })}
        >
          {inputFormattedDate}
        </div>
      )}
      {daysToBirthday >= 0 && daysToBirthday <= 30 && !!inputFormattedDate && (
        <div
          className={cn(classes.dateDiffValue, {
            rowSelected: isRowSelected
          })}
        >
          <span>(</span>
          {daysToBirthday > 0 && (
            <span>{`in ${daysToBirthday} day${
              daysToBirthday == 1 ? '' : 's'
            }`}</span>
          )}
          {daysToBirthday == 0 && <span className="isToday">It's Today</span>}
          <span>)</span>
        </div>
      )}
    </>
  )

  return <CellContainer renderCellContent={renderCellContent} />
}

export default memo(BirthdayCell)
