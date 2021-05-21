import React from 'react'
import { makeStyles } from '@material-ui/styles'
import cn from 'classnames'

import { Tooltip, IconButton, useTheme } from '@material-ui/core'
import { mdiPencilOutline } from '@mdi/js'

import { ClassesProps } from 'utils/ts-utils'
import { isPastDay } from 'utils/date-times/is-past-day'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import { DateTime } from './DateTime'

import { sharedStyles } from '../../styles'
import { styles } from './styles'

const useSharedStyles = makeStyles(sharedStyles)
const useStyles = makeStyles(styles)

interface Props {
  title: React.ReactNode
  event: ICalendarEvent & { rowIndex?: number }
  editable: boolean
  Icon?: any
  actions?: React.ReactNode
  onClick?(): void
}

export function EventContainer({
  event,
  Icon,
  title,
  editable,
  actions,
  onClick,
  classes: inputClasses
}: Props & ClassesProps<typeof styles>) {
  const theme = useTheme()
  const sharedClasses = useSharedStyles({
    pastEvent: isPastDay(new Date(event.timestamp * 1000))
  })

  const classes = useStyles({
    classes: inputClasses,
    evenRow: event.rowIndex ? event.rowIndex % 2 === 0 : true,
    clickable: typeof onClick === 'function'
  })

  return (
    <div className={classes.root}>
      <button
        type="button"
        className={sharedClasses.buttonContainer}
        onClick={onClick}
      >
        Add
      </button>

      <div className={sharedClasses.row}>
        <div className={sharedClasses.container}>
          <div className={sharedClasses.time}>
            <DateTime event={event} />
          </div>
          <div className={cn(sharedClasses.container, sharedClasses.title)}>
            {Icon && (
              <div className={sharedClasses.icon}>
                <Icon
                  fill="#6A7589"
                  style={{ width: '16px', height: '16px' }}
                />
              </div>
            )}

            <div className={sharedClasses.title}>{title}</div>
          </div>
        </div>

        <div className={classes.actions}>
          {editable && (
            <Tooltip title="Edit Event" placement="top">
              <IconButton onClick={onClick}>
                <SvgIcon
                  path={mdiPencilOutline}
                  color={theme.palette.grey[400]}
                />
              </IconButton>
            </Tooltip>
          )}
          {actions}
        </div>
      </div>
    </div>
  )
}
