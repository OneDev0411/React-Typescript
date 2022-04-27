import { Badge, withStyles, Theme } from '@material-ui/core'

export const InlineBadge = withStyles((theme: Theme) => ({
  anchorOriginTopRightRectangle: {
    top: theme.spacing(-1.25),
    right: 'auto',
    left: `calc(100% + ${theme.spacing(1)}px)`,
    transform: 'scale(1) translateY(50%)',
    borderRadius: theme.shape.borderRadius
  }
}))(Badge)
