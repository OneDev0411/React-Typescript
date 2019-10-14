import React from 'react'
import fecha from 'fecha'
import { Box, Link, Typography } from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

interface Props {
  deal: UUID
  title: string
  value: number
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: theme.spacing(1)
    },
    title: {
      color: theme.palette.text.primary
    },
    value: {
      textAlign: 'right'
    }
  })
)

export default function DealContextField({ title, value, deal }: Props) {
  const classes = useStyles()

  return (
    <Box className={classes.container}>
      <Link
        className={classes.title}
        href={`/dashboard/deals/${deal}`}
        target="_blank"
      >
        {title}
      </Link>
      <Typography component="span" className={classes.value}>
        {fecha.format(new Date(value * 1000), 'MMM DD, YYYY')}
      </Typography>
    </Box>
  )
}
