import { makeStyles, Theme } from '@material-ui/core'

export const useCommonStyles = makeStyles(
  (theme: Theme) => ({
    container: {
      width: '100%',
      background: theme.palette.background.paper,
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: theme.shape.borderRadius
    },
    content: {
      padding: theme.spacing(1, 1.5)
    },
    footer: {
      padding: theme.spacing(1, 1.5),
      borderTop: `1px solid ${theme.palette.divider}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end'
    }
  }),
  { name: 'NewFlowCommonStyle' }
)
