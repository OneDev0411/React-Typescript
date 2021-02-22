import { makeStyles, Theme } from '@material-ui/core'

export const useStyles = makeStyles(
  (theme: Theme) => ({
    form: {
      width: '100%'
    },
    container: {
      width: '100%',
      background: theme.palette.background.paper,
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: theme.shape.borderRadius
    },
    header: {
      padding: theme.spacing(1.5, 3),
      background: theme.palette.grey[100],
      borderRadius: `${theme.shape.borderRadius}px 0 0 ${theme.shape.borderRadius}px`
    },
    title: {
      // marginBottom: theme.spacing(2)
    },
    dragBtn: {
      display: 'flex',
      marginRight: theme.spacing(1.5)
    },
    commonFieldsContainer: {
      padding: theme.spacing(2.5, 5),
      borderBottom: `1px solid ${theme.palette.divider}`
    },
    commonFieldsTitle: {
      marginBottom: theme.spacing(2)
    },
    commonFields: {
      display: 'flex',
      alignItems: 'center',
      flexWrap: 'nowrap'
    }
  }),
  { name: 'BaseFormLayout' }
)
