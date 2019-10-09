import React from 'react'
import fecha from 'fecha'
import { Button, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { Theme, createStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    tourItem: {
      marginBottom: theme.spacing(2),

      '& .MuiButton-label': {
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'flex-start'
      }
    },
    title: {
      width: '100%',
      textAlign: 'left'
    }
  })
)

interface Props {
  dueDate: number
  onClick: () => void
  title: string
}

export default function TourItem({ dueDate, onClick, title }: Props) {
  const classes = useStyles()
  const date = fecha.format(
    new Date(dueDate * 1000),
    'dddd, MMM DD YYYY hh:mm A'
  )

  return (
    <Button onClick={onClick} fullWidth className={classes.tourItem}>
      <Typography variant="button" noWrap>
        {date}
      </Typography>
      <Typography
        component="span"
        variant="body2"
        color="textSecondary"
        noWrap
        className={classes.title}
      >
        {title}
      </Typography>
    </Button>
  )
}
