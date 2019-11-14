import React from 'react'

import { makeStyles } from '@material-ui/styles'
import { fade } from '@material-ui/core/styles'

import { ClassesProps } from 'utils/ts-utils'

import { DateTime } from './DateTime'

import inlineStyles from '../../styles'
import { styles } from './styles'

const useStyles = makeStyles(styles)

interface Props {
  style: React.CSSProperties
  event: ICalendarEvent
  nextItem: ICalendarListRow
  icon?: {
    color: string
    element: any
  }
  title: React.ReactNode
  subtitle?: React.ReactNode
  actions?: React.ReactNode
  onClick?(): void
}

export function EventContainer({
  style,
  event,
  nextItem,
  icon,
  title,
  subtitle,
  actions,
  onClick,
  classes: inputClasses
}: Props & ClassesProps<typeof styles>) {
  const hasBorderBottom = nextItem && !nextItem.hasOwnProperty('isEventHeader')
  const classes = useStyles({
    classes: inputClasses,
    hasBorderBottom,
    clickable: typeof onClick === 'function'
  })

  return (
    <div style={style}>
      <div className={classes.root}>
        <button
          type="button"
          style={inlineStyles.buttonContainer}
          onClick={onClick}
        />

        <div style={inlineStyles.row}>
          <div style={inlineStyles.container}>
            <div style={inlineStyles.time}>
              <DateTime event={event} />
            </div>
            <div
              style={{
                ...inlineStyles.container,
                ...inlineStyles.title
              }}
            >
              {icon && (
                <div
                  style={{
                    ...inlineStyles.icon,
                    backgroundColor: fade(icon.color, 0.2)
                  }}
                >
                  <icon.element
                    fill={icon.color}
                    style={{ width: '24px', height: '24px' }}
                  />
                </div>
              )}

              {title}
            </div>
          </div>

          <div>{actions}</div>
        </div>

        <div style={inlineStyles.row}>
          <div style={inlineStyles.subtitle}>{subtitle}</div>
        </div>
      </div>
    </div>
  )
}
