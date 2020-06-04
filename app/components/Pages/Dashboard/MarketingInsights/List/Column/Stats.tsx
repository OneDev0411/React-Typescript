import React from 'react'
import { Tooltip, makeStyles, createStyles, Theme } from '@material-ui/core'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      position: 'relative'
    },
    statLabel: {
      display: 'block',
      textAlign: 'center',
      lineHeight: theme.typography.button.lineHeight,
      cursor: 'help'
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
    <Tooltip title={details}>
      <span className={classes.statLabel}>{title}</span>
    </Tooltip>
  )
}

export default StatsColumn
