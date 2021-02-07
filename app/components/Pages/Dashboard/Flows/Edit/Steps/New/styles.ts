import { makeStyles, Theme } from '@material-ui/core'

export const useCommonStyles = makeStyles(
  (theme: Theme) => ({
    container: {
      width: '100%',
      background: theme.palette.background.paper,
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: theme.shape.borderRadius
    },
    title: {
      marginBottom: theme.spacing(1.5)
    },
    content: {
      padding: theme.spacing(2, 2)
    },
    extraItems: {
      paddingLeft: theme.spacing(2),
      [theme.breakpoints.down('xs')]: {
        paddingTop: theme.spacing(2),
        paddingLeft: 0
      }
    },
    footer: {
      padding: theme.spacing(1, 2),
      borderTop: `1px solid ${theme.palette.divider}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end'
    }
  }),
  { name: 'NewFlowCommonStyle' }
)
