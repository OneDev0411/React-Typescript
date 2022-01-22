import { memo, useMemo } from 'react'

import { makeStyles } from '@material-ui/core'
import cn from 'classnames'
import fecha from 'fecha'
import moment from 'moment'

import CellContainer from './CellContainer'

const useStyles = makeStyles(
  theme => ({
    dateDiffValue: {
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
    },
    dateValue: {
      ...theme.typography.body3,
      letterSpacing: '0.15px',
      lineHeight: `${theme.spacing(3)}px`,
      color: theme.palette.grey['500'],
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

//--

interface Props {
  contact: IContact
  onSave?: (e: any) => void
  isRowSelected?: boolean
}

const BirthdayCell = ({ contact, isRowSelected = false }: Props) => {
  const classes = useStyles()

  //

  const getDateOfBirth = () => {
    let birthday

    contact.attributes?.filter(attr => {
      if (!attr.is_partner && attr.attribute_type === 'birthday') {
        birthday = new Date(attr.date * 1000)

        return true
      }

      return false
    })

    return birthday
  }

  const daysToNextBirthday = () => {
    if (!birthday) {
      return
    }

    let dateDiff: number =
      birthdayThisYear(birthday).getTime() - today.getTime()

    if (dateDiff > 0) {
      return moment.duration(dateDiff).asDays()
    }

    dateDiff = birthdayNextYear(birthday).getTime() - today.getTime()

    return moment.duration(dateDiff).asDays()
  }

  //

  const today: Date = useMemo(getDate, [])
  const birthday: Date = useMemo(getDateOfBirth, [contact.attributes])
  const daysToBirthday = useMemo(daysToNextBirthday, [today, birthday])
  const inputFormattedDate: string = useMemo(
    () => formatDate(birthday),
    [birthday]
  )

  //

  const renderCellContent = () => (
    <>
      {daysToBirthday && (
        <div
          className={cn(classes.dateDiffValue, { rowSelected: isRowSelected })}
        >
          {`in ${daysToBirthday} day${daysToBirthday == 1 ? '' : 's'}`}
        </div>
      )}
      {daysToBirthday && inputFormattedDate && (
        <div
          className={cn(classes.dateValue, { rowSelected: isRowSelected })}
        >{`(${inputFormattedDate})`}</div>
      )}
    </>
  )

  return <CellContainer renderCellContent={renderCellContent} />
}

export default memo(BirthdayCell)
