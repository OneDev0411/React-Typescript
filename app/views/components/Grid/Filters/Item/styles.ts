import { Theme, makeStyles } from '@material-ui/core'

export const useStyles = makeStyles(
  (theme: Theme) => ({
    container: {
      position: 'relative',
      margin: theme.spacing(0.5, 1, 0.5, 0)
    },
    content: {
      position: 'absolute',
      top: '40px',
      left: 0,
      width: '300px',
      zIndex: theme.zIndex.modal,
      background: theme.palette.common.white,
      borderRadius: `${theme.shape.borderRadius}px`,
      boxShadow: theme.shadows[3]
    },
    incomplete: {
      color: theme.palette.error.main,
      borderColor: theme.palette.error.main
    },
    filterChip: {
      display: 'flex',
      alignItems: 'center',
      ...theme.typography.body2
    },
    filterLabel: {
      marginRight: theme.spacing(0.5)
    }
  }),
  { name: 'FilterItem' }
)
