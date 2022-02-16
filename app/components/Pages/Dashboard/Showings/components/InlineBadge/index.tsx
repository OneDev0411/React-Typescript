import { Badge, withStyles, Theme } from '@material-ui/core'

export const InlineBadge = withStyles((theme: Theme) => ({
  anchorOriginTopRightRectangle: {
    fontSize: theme.typography.subtitle2.fontSize,
    minWidth: theme.spacing(3),
    height: theme.spacing(3),
    borderRadius: '50%'
  }
}))(Badge)
