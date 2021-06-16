import React from 'react'
import { Box, Chip, Typography, makeStyles, Theme } from '@material-ui/core'

import { noop } from 'utils/helpers'

interface Props {
  title: string
  count: number
  disabled?: boolean
  onClick: () => void
}

const useStyles = makeStyles(
  (theme: Theme) => ({
    container: {
      display: 'inline-flex',
      alignItems: 'baseline',
      padding: theme.spacing(1),
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: `${theme.shape.borderRadius}px`,
      cursor: ({ disabled }: Pick<Props, 'disabled'>) =>
        disabled ? 'default' : 'pointer',
      opacity: ({ disabled }: Pick<Props, 'disabled'>) => (disabled ? 0.5 : 1)
    },
    title: {
      marginLeft: theme.spacing(0.75)
    }
  }),
  { name: 'OtherContactsBadge' }
)

export const OtherContactsBadge = ({
  title,
  count,
  disabled = false,
  onClick = noop
}: Props) => {
  const classes = useStyles({ disabled })

  const handleOnClick = () => {
    if (disabled) {
      return
    }

    onClick()
  }

  return (
    <Box className={classes.container} onClick={handleOnClick}>
      <Chip color="primary" size="small" label={count} />
      <Typography variant="body2" className={classes.title}>
        {title}
      </Typography>
    </Box>
  )
}
