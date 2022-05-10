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
      alignItems: 'center',
      color: theme.palette.action.disabled
    },
    customActionContainer: {
      marginRight: theme.spacing(0.5)
    },
    saveButton: {
      marginRight: theme.spacing(0.5),
      color: theme.palette.primary.main,
      ...theme.typography.body2
    },
    actionButton: {
      cursor: 'pointer',
      '&:not(:last-child)': {
        marginRight: theme.spacing(0.5)
      }
    },
    errors: {
      display: 'flex',
      alignItems: 'center',
      color: theme.palette.error.main,
      cursor: 'help',
      ...theme.typography.button
    }
  }),
  {
    name: 'AttributeCell'
  }
)
