import React from 'react'
import { Typography, Theme } from '@material-ui/core'
import { makeStyles, createStyles } from '@material-ui/styles'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      position: 'relative',
      cursor: 'pointer'
    },
    badge: {
      width: theme.spacing(1.5),
      height: theme.spacing(1.5),
      position: 'absolute',
      transform: 'translateY(-50%)',
      top: '50%',
      borderRadius: '50%',
      backgroundColor: theme.palette.secondary.main,
      left: theme.spacing(2)
    },
    text: {
      paddingLeft: theme.spacing(5.5)
    },
    timeage: {
      position: 'absolute',
      right: theme.spacing(3),
      top: 0
    }
  })
)

interface Props {
  seen: boolean
  message: string
  onClick: () => void
}

export default function Message({ seen, message, onClick }: Props) {
  const classes = useStyles()

  return (
    <div className={classes.container} onClick={onClick}>
      {!seen && <div className={classes.badge} />}
      <Typography variant="body2" color="textPrimary" className={classes.text}>
        {message}
      </Typography>
    </div>
  )
}
