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
      padding: theme.spacing(0.5, 0),
      borderRadius: theme.shape.borderRadius,
      width: '100%',
      height: '100%'
    },
    date: {
      color: theme.palette.grey[600],
      ...theme.typography.body1,
      fontSize: theme.typography.h6.fontSize // Shayan is asked for it
    },
    dateAlias: {
      color: theme.palette.common.black,
      ...theme.typography.h6
    },
    splitter: {
      width: '3px',
      height: '3px',
      borderRadius: '100%',
      backgroundColor: theme.palette.grey[400],
      margin: theme.spacing(0, 1)
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
          {props.item.isToday && (
            <>
              <span className={classes.dateAlias}>Today</span>
              <span className={classes.splitter} />
            </>
          )}
          {props.item.isTomorrow && (
            <>
              <span className={classes.dateAlias}>Tomorrow</span>
              <span className={classes.splitter} />
            </>
          )}
          <span className={classes.date}>{props.item.title}</span>
        </div>
      </div>
    </div>
  )
}
