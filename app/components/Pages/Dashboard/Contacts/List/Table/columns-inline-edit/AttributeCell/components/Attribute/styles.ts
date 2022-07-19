import { makeStyles, Theme } from '@material-ui/core'

export const useAttributeStyles = makeStyles(
  (theme: Theme) => ({
    container: {
      width: '100%',
      display: 'flex',
      padding: theme.spacing(1, 2),
      borderBottom: `1px solid ${theme.palette.divider}`
    },
    valuesContainer: {
      display: 'flex',
      paddingRight: theme.spacing(1),
      alignItems: 'center',
      flexGrow: 1
    },
    value: {
      flexGrow: 1
    },
    selectLabel: {
      '&:focus': {
        backgroundColor: 'transparent'
      }
    },
    actionContainer: {
      display: 'flex',
      alignItems: 'center'
    },
    customActionContainer: {
      marginRight: theme.spacing(0.75)
    },
    saveButton: {
      marginRight: theme.spacing(0.75),
      color: theme.palette.primary.main,
      ...theme.typography.body2,
      '&:disabled': {
        color: theme.palette.action.disabled
      }
    },
    discardButton: {
      color: theme.palette.grey[900],
      ...theme.typography.body2,
      '&:disabled': {
        color: theme.palette.action.disabled
      }
    },
    actionButton: {
      cursor: 'pointer',
      color: theme.palette.action.disabled,
      '&:not(:last-child)': {
        marginRight: theme.spacing(0.5)
      },
      '&:hover': {
        color: theme.palette.grey[800]
      }
    },
    errors: {
      display: 'flex',
      alignItems: 'center',
      color: theme.palette.error.main,
      cursor: 'help',
      ...theme.typography.button
    },
    errorLabel: {
      marginLeft: theme.spacing(0.5)
    }
  }),
  {
    name: 'AttributeCell'
  }
)
