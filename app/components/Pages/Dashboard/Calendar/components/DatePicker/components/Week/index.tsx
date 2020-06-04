import React from 'react'
import { Button } from '@material-ui/core'
import fecha from 'fecha'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import cn from 'classnames'

import { getDaysOfWeek } from 'utils/date-times/days-of-week'

import IconArrowLeft from 'components/SvgIcons/ArrowLeftMui/IconArrowLeft'
import IconArrowRight from 'components/SvgIcons/ArrowRightMui/IconArrowRight'

import { useIconStyles } from 'views/../styles/use-icon-styles'

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
      backgroundColor: theme.palette.grey[100],
      margin: theme.spacing(0, 0.25),
      color: theme.palette.grey[600]
    },
    weekDay: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: theme.spacing(0.5, 0),
      width: '4rem',
      color: theme.palette.grey[600],
      backgroundColor: theme.palette.grey[100],
      cursor: 'pointer',
      '&:hover': {
        backgroundColor: theme.palette.action.hover
      },
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
  const iconClasses = useIconStyles()

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
        <IconArrowLeft className={iconClasses.rightMargin} />
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
        <IconArrowRight className={iconClasses.leftMargin} />
      </Button>
    </>
  )
}
