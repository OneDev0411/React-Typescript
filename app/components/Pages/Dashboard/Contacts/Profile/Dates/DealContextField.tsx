import React from 'react'
import fecha from 'fecha'
import { Link, Typography, Tooltip } from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

interface Props {
  deal: UUID
  title: string
  value: number
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      width: '100%',
      padding: theme.spacing(1),
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      color: theme.palette.text.primary,
      borderRadius: theme.shape.borderRadius,
      '&:hover': {
        textDecoration: 'none',
        color: theme.palette.secondary.main,
        background: theme.palette.action.hover
      }
    },
    value: {
      color: theme.palette.grey[500],
      textAlign: 'right'
    }
  })
)

export default function DealContextField({ title, value, deal }: Props) {
  const classes = useStyles()

  return (
    <Tooltip title="Home Anniversary">
      <Link
        className={classes.container}
        href={`/dashboard/deals/${deal}`}
        target="_blank"
      >
        <Typography variant="body2">{title}</Typography>
        <Typography variant="body2" className={classes.value}>
          {fecha.format(new Date(value * 1000), 'MMM DD, YYYY')}
        </Typography>
      </Link>
    </Tooltip>
  )
}
