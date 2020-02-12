import React from 'react'

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'

interface IProps {
  activeDate: Date | null
  style: React.CSSProperties
  item: ICalendarEventHeader
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    flex: {
      display: 'flex',
      alignItems: 'center'
    },
    container: {
      display: 'flex',
      alignItems: 'flex-end',
      padding: '0 1rem',
      borderRadius: '4px',
      width: '100%',
      height: '100%'
    },
    date: {
      color: '#6A7589',
      fontSize: theme.typography.h6.fontSize
    }
  })
)

/**
 * renders the day header
 * @param props
 */
export function EventHeader(props: IProps) {
  const classes = useStyles()

  return (
    <div style={props.style}>
      <div className={classes.container}>
        <div className={classes.flex}>
          {props.item.isToday && 'Today - '}
          <span className={classes.date}>{props.item.title}</span>
        </div>
      </div>
    </div>
  )
}
