import React from 'react'
import { Box, Chip, Typography, makeStyles, Theme } from '@material-ui/core'

import { noop } from 'utils/helpers'

const useStyles = makeStyles(
  (theme: Theme) => ({
    container: {
      display: 'inline-flex',
      alignItems: 'baseline',
      padding: theme.spacing(1),
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: `${theme.shape.borderRadius}px`,
      cursor: 'pointer'
    },
    title: {
      marginLeft: theme.spacing(0.75)
    }
  }),
  { name: 'OtherContactsBadge' }
)

interface Props {
  title: string
  count: number
  onClick: () => void
}

export const OtherContactsBadge = ({ title, count, onClick = noop }: Props) => {
  const classes = useStyles()

  return (
    <Box className={classes.container} onClick={onClick}>
      <Chip color="primary" size="small" label={count} />
      <Typography variant="body2" className={classes.title}>
        {title}
      </Typography>
    </Box>
  )
}
