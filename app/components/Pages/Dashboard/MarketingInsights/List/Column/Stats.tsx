import React from 'react'
import {
  List,
  ListItem,
  ListItemText,
  makeStyles,
  createStyles,
  Theme
} from '@material-ui/core'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      position: 'relative'
    },
    statLabel: {
      display: 'block',
      textAlign: 'center',
      lineHeight: theme.typography.button.lineHeight,
      cursor: 'help',
      '&:hover + $popover': {
        visibility: 'visible'
      }
    },
    popover: {
      minWidth: 160,
      position: 'absolute',
      top: 0,
      left: 0,
      marginTop: theme.spacing(3.5),
      background: '#fff',
      visibility: 'hidden',
      borderRadius: theme.shape.borderRadius,
      boxShadow: theme.shadows[1],
      zIndex: 1,
      '&:hover': {
        visibility: 'visible'
      }
    }
  })
)

interface Props {
  title: string
  details: string
}

function StatsColumn({ title, details }: Props) {
  const classes = useStyles()

  return (
    <div className={classes.container}>
      <span className={classes.statLabel}>{title}</span>
      <List disablePadding className={classes.popover}>
        <ListItem>
          <ListItemText primary={details} />
        </ListItem>
      </List>
    </div>
  )
}

export default StatsColumn
