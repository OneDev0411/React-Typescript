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
      textDecoration: 'underline',
      '&:hover + $popover': {
        visibility: 'visible'
      }
    },
    popover: {
      minWidth: 160,
      position: 'absolute',
      top: 0,
      left: theme.spacing(-6.5),
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
  value: string
  primaryHint: string
  secondryHint: string
}

function StatsColumn({ value, primaryHint, secondryHint }: Props) {
  const classes = useStyles()

  return (
    <div className={classes.container}>
      <span className={classes.statLabel}>{value}</span>
      <List disablePadding className={classes.popover}>
        <ListItem>
          <ListItemText primary={primaryHint} secondary={secondryHint} />
        </ListItem>
      </List>
    </div>
  )
}

export default StatsColumn
