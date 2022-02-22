import { memo, useMemo } from 'react'

import { makeStyles } from '@material-ui/core'
import cn from 'classnames'
import { some } from 'lodash'

import { CellProps } from '../../types'

import { DateCell } from './types/DateCell'
import {
  durationAsDays,
  formatDate,
  getDate,
  getDateDiff
} from './types/DateCell/helpers'

const useStyles = makeStyles(
  theme => ({
    dateDiffValue: {
      ...theme.typography.body3,
      lineHeight: `${theme.spacing(3)}px`,
      color: theme.palette.grey['500']
    },
    selected: {
      color: theme.palette.tertiary.dark
    },
    hovered: {
      color: theme.palette.tertiary.dark
    },
    rowSelected: {
      color: theme.palette.tertiary.dark
    },
    isToday: {
      ...theme.typography.button,
      color: theme.palette.primary.main
    },
    dateValue: {
      ...theme.typography.body2,
      color: theme.palette.grey[700],
      lineHeight: `${theme.spacing(3)}px`
    }
  }),
  { name: 'BirthdayCell' }
)

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

const getDateOfBirth = contact => {
  let date: Nullable<Date> = null

  some(contact.attributes, attr => {
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

interface Props {
  contact: IContact
  onSave?: (e: any) => void
  isRowSelected?: boolean
}

export const BirthdayCell = memo(
  ({ contact, isRowSelected = false }: Props) => {
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
      const birthdayIsToday = daysToBirthday === 0

      return (
        <>
          <div
            className={cn(classes.dateValue, {
              [classes.hovered]: isHovered,
              [classes.selected]: isSelected
            })}
          >
            {formattedDate}
          </div>

          {birthdayApproaching && (
            <div
              className={cn(classes.dateDiffValue, {
                [classes.rowSelected]: isRowSelected
              })}
            >
              <span>(</span>
              <span
                className={cn({
                  [classes.isToday]: birthdayIsToday
                })}
              >
                {birthdayIsToday && "It's Today"}
                {daysToBirthday > 0 &&
                  `in ${daysToBirthday} day${daysToBirthday == 1 ? '' : 's'}`}
              </span>
              <span>)</span>
            </div>
          )}
        </>
      )
    }

    return <DateCell value={birthday} renderCellContent={renderCellContent} />
  }
)
