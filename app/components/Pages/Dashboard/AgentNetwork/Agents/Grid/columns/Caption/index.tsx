import React from 'react'
import {
  Typography,
  WithStyles,
  Theme,
  TypographyVariant,
  withStyles
} from '@material-ui/core'

interface Props extends WithStyles<typeof styles> {
  children: React.ReactNode
  variant?: TypographyVariant
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
