import React from 'react'
import { makeStyles } from '@material-ui/styles'
import cn from 'classnames'

import { ClassesProps } from 'utils/ts-utils'

import { DateTime } from './DateTime'

import { sharedStyles } from '../../styles'
import { styles } from './styles'

const useSharedStyles = makeStyles(sharedStyles)
const useStyles = makeStyles(styles)

interface Props {
  style: React.CSSProperties
  event: ICalendarEvent
  Icon?: any
  title: React.ReactNode
  subtitle?: React.ReactNode
  actions?: React.ReactNode
  onClick?(): void
}

export function EventContainer({
  style,
  event,
  Icon,
  title,
  subtitle,
  actions,
  onClick,
  classes: inputClasses
}: Props & ClassesProps<typeof styles>) {
  const sharedClasses = useSharedStyles()
  const classes = useStyles({
    classes: inputClasses,
    clickable: typeof onClick === 'function'
  })

  return (
    <div style={style}>
      <div className={classes.root}>
        <button
          type="button"
          className={sharedClasses.buttonContainer}
          onClick={onClick}
        />

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

          <div>{actions}</div>
        </div>

        <div className={sharedClasses.row}>
          <div className={sharedClasses.subtitle}>{subtitle}</div>
        </div>
      </div>
    </div>
  )
}
