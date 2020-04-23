import React from 'react'
import { withStyles, WithStyles, Theme } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'
import { Variant } from '@material-ui/core/styles/createTypography'

interface Props extends WithStyles<typeof styles> {
  children: React.ReactNode
  variant?: Variant
}

const styles = (theme: Theme) => ({
  root: {
    color: theme.palette.grey[500]
  }
})

export const Caption = withStyles(styles)(
  ({ children, variant, classes }: Props) => (
    <Typography variant={variant || 'caption'} className={classes.root}>
      {children}
    </Typography>
  )
)
