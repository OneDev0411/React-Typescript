import React from 'react'
import fecha from 'fecha'

import { makeStyles } from '@material-ui/styles'
import { Theme, fade } from '@material-ui/core/styles'

import styles from '../../styles'

interface StyleProps {
  hasBorderBottom: boolean | null
  clickable: boolean
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    height: '100%',
    cursor: (props: StyleProps) => (props.clickable ? 'pointer' : 'auto'),
    borderBottom: (props: StyleProps) =>
      props.hasBorderBottom ? '1px solid rgba(219, 230, 253, 0.5)' : 'none',
    '& button, a.MuiButtonBase-root': {
      borderColor: '#eee',
      color: '#eee'
    },
    '&:hover': {
      transition: '0.2s ease-in background-color',
      backgroundColor: theme.palette.action.hover,
      '& button, a.MuiButtonBase-root': {
        borderColor: 'inherit',
        color: 'inherit'
      }
    },
    '& a': {
      color: theme.palette.secondary.dark
    },
    '&:hover a': {
      color: theme.palette.primary.main
    }
  }
}))

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
  onClick
}: Props) {
  const date =
    event.object_type === 'crm_task'
      ? fecha.format(new Date(event.timestamp * 1000), 'hh:mm A')
      : 'All day'

  const hasBorderBottom = nextItem && !nextItem.hasOwnProperty('isEventHeader')

  const classes = useStyles({
    hasBorderBottom,
    clickable: typeof onClick === 'function'
  })

  return (
    <div style={style}>
      <div className={classes.root}>
        <button
          type="button"
          style={styles.buttonContainer}
          onClick={onClick}
        />

        <div style={styles.row}>
          <div style={styles.container}>
            <div style={styles.time}>{date}</div>
            <div
              style={{
                ...styles.container,
                ...styles.title
              }}
            >
              {icon && (
                <div
                  style={{
                    ...styles.icon,
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

        <div style={styles.row}>
          <div style={styles.subtitle}>{subtitle}</div>
        </div>
      </div>
    </div>
  )
}
