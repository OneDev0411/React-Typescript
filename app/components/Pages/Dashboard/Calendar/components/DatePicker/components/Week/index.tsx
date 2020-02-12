import React from 'react'
import { Button } from '@material-ui/core'
import fecha from 'fecha'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import cn from 'classnames'

import { useStyles as useCommonStyles } from '../use-styles'

interface Props {
  date: Date
  onChange: (day: Date) => void
  onClickPastWeek: () => void
  onClickNextWeek: () => void
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    weekNavigationButton: {
      backgroundColor: '#F2F3F7', // TODO: change
      margin: theme.spacing(0, 0.5),
      color: theme.palette.common.black
    },
    weekDay: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: theme.spacing(0.5, 0),
      width: '3.5rem',
      color: '#606974', // TODO: change
      backgroundColor: '#F2F3F7', // TODO: change
      cursor: 'pointer',
      '&.active': {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
        borderRadius: theme.shape.borderRadius
      }
    },
    dayName: {
      fontSize: theme.typography.caption.fontSize
    },
    dayNumber: {
      fontSize: theme.typography.body1.fontSize,
      fontWeight: theme.typography.fontWeightBlack
    }
  })
)

export function Week({
  date,
  onChange,
  onClickPastWeek,
  onClickNextWeek
}: Props) {
  const classes = useStyles()
  const commonClasses = useCommonStyles()

  const isToday = (dt: Date) =>
    fecha.format(dt, 'yyyymmdd') === fecha.format(date, 'yyyymmdd')

  return (
    <>
      <Button
        color="secondary"
        className={cn(
          classes.weekNavigationButton,
          commonClasses.button,
          commonClasses.sharp
        )}
        onClick={onClickPastWeek}
      >
        Last Week
      </Button>

      {getDaysOfWeek(date).map((date: Date, index: number) => (
        <div
          key={index}
          className={cn(classes.weekDay, { active: isToday(date) })}
          onClick={() => onChange(date)}
        >
          <div className={classes.dayName}>{fecha.format(date, 'ddd')}</div>
          <div className={classes.dayNumber}>{fecha.format(date, 'DD')}</div>
        </div>
      ))}

      <Button
        color="secondary"
        className={cn(
          classes.weekNavigationButton,
          commonClasses.button,
          commonClasses.rightRounded
        )}
        onClick={onClickNextWeek}
      >
        Next Week
      </Button>
    </>
  )
}

function getDaysOfWeek(date: Date): Date[] {
  const firstDayOfWeek = date.getDate() - date.getDay()

  return new Array(7).fill(null).map((_, index) => {
    const weekDay = new Date(date)

    weekDay.setDate(firstDayOfWeek + index)

    return weekDay
  })
}
