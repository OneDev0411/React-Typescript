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
  ({ children, variant, classes }: Props) => (
    <Tooltip title={children}>
      <Typography
        noWrap
        variant={variant || 'caption'}
        className={classes.root}
      >
        {children}
      </Typography>
    </Tooltip>
  )
)
