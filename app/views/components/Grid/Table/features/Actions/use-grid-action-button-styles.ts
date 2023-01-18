import { alpha, makeStyles, Theme } from '@material-ui/core'

export const useGridActionButtonStyles = makeStyles(
  (theme: Theme) => ({
    root: {
      position: 'sticky',
      bottom: `${theme.spacing(3.5)}px`,
      width: '100%',
      height: theme.spacing(10),
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-around',
      padding: theme.spacing(0, 2),
      background: theme.palette.tertiary.main,
      borderRadius: `${theme.spacing(2)}px`,
      boxShadow: `0 ${theme.spacing(0.5)}px ${theme.spacing(2)}px ${alpha(
        theme.palette.common.black,
        0.4
      )}`,
      zIndex: theme.zIndex.gridAction
    }
  }),
  {
    name: 'GridActionButtonStyles'
  }
)
