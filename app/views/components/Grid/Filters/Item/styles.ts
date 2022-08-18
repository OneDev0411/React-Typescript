import { Theme, makeStyles } from '@material-ui/core'

export const useStyles = makeStyles(
  (theme: Theme) => ({
    container: {
      position: 'relative',
      marginRight: theme.spacing(1)
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
    }
  }),
  { name: 'FilterItem' }
)
