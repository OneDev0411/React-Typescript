import { makeStyles, Theme } from '@material-ui/core'

export const useCommonStyles = makeStyles(
  (theme: Theme) => ({
    stepContainer: {
      display: 'flex',
      width: '100%',
      maxWidth: '730px',
      margin: theme.spacing(0, 'auto', 2)
    },
    stepIndex: {
      width: theme.spacing(5),
      height: theme.spacing(5),
      marginRight: theme.spacing(1),
      borderRadius: '50%',
      color: theme.palette.grey[800],
      border: `1px solid ${theme.palette.divider}`,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    },
    itemContent: {
      flexGrow: 1
    }
  }),
  { name: 'StepItem' }
)
