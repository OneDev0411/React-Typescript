import React from 'react'
import { makeStyles } from '@material-ui/styles'
import cn from 'classnames'

import { Tooltip } from '@material-ui/core'

import { useIconStyles } from 'views/../styles/use-icon-styles'

import { ClassesProps } from 'utils/ts-utils'
import { isPastDay } from 'utils/date-times/is-past-day'

import EditIcon from 'components/SvgIcons/Edit/EditIcon'

import { DateTime } from './DateTime'

import { sharedStyles } from '../../styles'
import { styles } from './styles'

const useSharedStyles = makeStyles(sharedStyles)
const useStyles = makeStyles(styles)

interface Props {
  style: React.CSSProperties
  title: React.ReactNode
  event: ICalendarEvent & { rowIndex?: number }
  editable: boolean
  Icon?: any
  actions?: React.ReactNode
  onClick?(): void
}

export function EventContainer({
  style,
  event,
  Icon,
  title,
  editable,
  actions,
  onClick,
  classes: inputClasses
}: Props & ClassesProps<typeof styles>) {
  const sharedClasses = useSharedStyles({
    pastEvent: isPastDay(new Date(event.timestamp * 1000))
  })

  const iconStyles = useIconStyles()
  const classes = useStyles({
    classes: inputClasses,
    evenRow: event.rowIndex ? event.rowIndex % 2 === 0 : true,
    clickable: typeof onClick === 'function'
  })

  return (
    <div style={style}>
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
                    style={{ width: '24px', height: '24px' }}
                  />
                </div>
              )}

              {title}
            </div>
          </div>

          <div className={classes.actions}>
            {editable && (
              <Tooltip title="Edit Event" placement="top">
                <EditIcon
                  className={cn(iconStyles.small, classes.iconEdit)}
                  onClick={onClick}
                />
              </Tooltip>
            )}
            {actions}
          </div>
        </div>
      </div>
    </div>
  )
}
