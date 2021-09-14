import { ReactChild } from 'react'

import {
  Typography,
  WithStyles,
  Theme,
  TypographyVariant,
  withStyles,
  Tooltip
} from '@material-ui/core'

interface Props extends WithStyles<typeof styles> {
  children: ReactChild
  variant?: TypographyVariant
}

const styles = (theme: Theme) => ({
  root: {
    color: theme.palette.grey[500]
  }
})

export const Caption = withStyles(styles)(
  ({ children, variant = 'caption', classes }: Props) => (
    <Tooltip title={children}>
      <Typography noWrap variant={variant} className={classes.root}>
        {children}
      </Typography>
    </Tooltip>
  )
)
