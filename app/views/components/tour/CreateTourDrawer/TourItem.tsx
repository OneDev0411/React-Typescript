import React from 'react'
import fecha from 'fecha'
import { Button, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { Theme, createStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      marginBottom: theme.spacing(2)
    },
    buttonLabel: {
      flexDirection: 'column',
      alignItems: 'flex-start',
      justifyContent: 'flex-start'
    },
    title: {
      width: '100%'
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
    <Button
      onClick={onClick}
      fullWidth
      className={classes.root}
      classes={{ label: classes.buttonLabel }}
    >
      <Typography variant="button" noWrap>
        {date}
      </Typography>
      <Typography
        variant="body2"
        color="textSecondary"
        noWrap
        align="left"
        className={classes.title}
      >
        {title}
      </Typography>
    </Button>
  )
}
