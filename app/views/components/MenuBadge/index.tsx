import { Badge, withStyles, Theme } from '@material-ui/core'

export const MenuBadge = withStyles((theme: Theme) => ({
  root: {
    width: '100%',
    alignItems: 'center'
  },
  anchorOriginTopRightRectangle: {
    top: theme.spacing(-1),
    right: 0,
    left: 'auto',
    padding: theme.spacing(0.5),
    transform: 'scale(1) translateY(50%)',
    borderRadius: '50%',
    fontWeight: theme.typography.subtitle3.fontWeight,
    backgroundColor: theme.palette.error.dark,
    color: theme.palette.common.white
  }
}))(Badge)
