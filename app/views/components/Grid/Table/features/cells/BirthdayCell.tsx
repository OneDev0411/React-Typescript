import { memo } from 'react'

import { makeStyles } from '@material-ui/core'
import fecha from 'fecha'

import { getAttributeFromSummary } from '@app/models/contacts/helpers'

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
        color: theme.palette.primary.main
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

//---

function formatDate(
  timestamp: number,
  format: string = 'MMM DD, YYYY'
): string {
  const date = new Date(timestamp * 1000)
  const year = date.getUTCFullYear()
  const month = date.getUTCMonth()
  const day = date.getUTCDate()

  const utcDate = new Date(year, month, day)

  if (utcDate.getFullYear() === 1800) {
    return fecha.format(utcDate, 'MMM DD')
  }

  return fecha.format(utcDate, format)
}

//---

interface Props {
  contact: IContact
  onSave?: (e: any) => void
  isRowSelected?: boolean
}

const BirthdayCell = ({ contact, isRowSelected = false }: Props) => {
  const classes = useStyles()

  let inputFormattedDate: string
  let daysToBirthday: number

  // const now: Date = new Date()
  const birthday: Date = new Date(getAttributeFromSummary(contact, 'birthday'))
  // const daysToBirthday: number = moment.duration(now.getTime() - birthday.getTime()).asDays()

  if (birthday) {
    console.log('birthday', birthday)

    inputFormattedDate = formatDate(birthday.getTime())
  }

  const renderCellContent = () => (
    <>
      {daysToBirthday && (
        <div className={classes.dateDiffValue}>
          {`in ${daysToBirthday} day${daysToBirthday == 1 ? '' : 's'}`}
        </div>
      )}
      {inputFormattedDate && (
        <div className={classes.dateValue}>{`(${inputFormattedDate})`}</div>
      )}
    </>
  )

  return <CellContainer renderCellContent={renderCellContent} />
}

export default memo(BirthdayCell)
