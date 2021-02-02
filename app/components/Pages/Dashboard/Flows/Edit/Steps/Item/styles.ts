import { makeStyles, Theme } from '@material-ui/core'

export const useCommonStyles = makeStyles(
  (theme: Theme) => ({
    stepContainer: {
      display: 'flex',
      width: '100%',
      marginBottom: theme.spacing(2)
    },
    stepIndex: {
      width: theme.spacing(5),
      height: theme.spacing(5),
      marginRight: theme.spacing(1),
      borderRadius: '50%',
      color: theme.palette.text.secondary,
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
