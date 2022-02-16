import React, { memo, useMemo } from 'react'

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
      lineHeight: `${theme.spacing(3)}px`,
      color: theme.palette.grey['500'],

      '&.selected': {
        color: theme.palette.tertiary.dark
      },
      '&.rowSelected': {
        color: theme.palette.tertiary.dark
      }
    },
    isToday: {
      ...theme.typography.button,
      color: theme.palette.primary.main
    },
    dateValue: {
      ...theme.typography.body2,
      color: theme.palette.grey[700],
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

const formatDate = (
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
  let date: Nullable<Date> = null

  contact.attributes?.filter(attr => {
    if (!attr.is_partner && attr.attribute_type === 'birthday') {
      date = new Date(attr.date * 1000)

      return true
    }

    return false
  })

  return date
}

const daysToNextBirthday = (birthday, today): Nullable<number> => {
  if (!birthday) {
    return null
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
  width: number | string
}

const BirthdayCell = ({ contact, isRowSelected = false, width }: Props) => {
  const classes = useStyles()

  const today: Date = useMemo(getDate, [])
  const birthday: Nullable<Date> = useMemo(
    () => getDateOfBirth(contact),
    [contact]
  )
  const daysToBirthday: Nullable<number> = useMemo(
    () => daysToNextBirthday(birthday, today),
    [birthday, today]
  )
  const formattedDate: Nullable<string> = useMemo(
    () => formatDate(birthday),
    [birthday]
  )

  const renderCellContent = ({
    isHovered = false,
    isSelected = false
  }: CellProps) => {
    if (!formattedDate) {
      return null
    }

    const birthdayApproaching =
      daysToBirthday && daysToBirthday >= 0 && daysToBirthday <= 30

    return (
      <>
        <div
          className={cn(classes.dateValue, {
            hovered: isHovered,
            selected: isSelected
          })}
        >
          {formattedDate}
        </div>

        {birthdayApproaching && (
          <div
            className={cn(classes.dateDiffValue, {
              rowSelected: isRowSelected
            })}
          >
            <span>(</span>
            <span
              className={cn({
                [classes.isToday]: daysToBirthday === 0
              })}
            >
              {daysToBirthday === 0 && "It's Today"}
              {daysToBirthday > 0 &&
                `in ${daysToBirthday} day${daysToBirthday == 1 ? '' : 's'}`}
            </span>
            <span>)</span>
          </div>
        )}
      </>
    )
  }

  return <CellContainer renderCellContent={renderCellContent} width={width} />
}

export default memo(BirthdayCell)
