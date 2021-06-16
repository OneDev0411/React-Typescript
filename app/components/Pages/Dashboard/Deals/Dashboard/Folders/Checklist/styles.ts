import { makeStyles, Theme } from '@material-ui/core'

export const useStyles = makeStyles(
  (theme: Theme) => ({
    container: {
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: theme.shape.borderRadius,
      marginBottom: theme.spacing(2)
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      backgroundColor: theme.palette.grey['100'],
      padding: theme.spacing(1.75, 2),
      borderTopLeftRadius: theme.shape.borderRadius,
      borderTopRightRadius: theme.shape.borderRadius,
      borderBottom: `1px solid ${theme.palette.divider}`
    },
    titleContainer: {
      cursor: 'pointer'
    }
  }),
  {
    name: 'Checklists'
  }
)
