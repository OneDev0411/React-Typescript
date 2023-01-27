import { makeStyles, Theme } from '@material-ui/core'
import { alpha } from '@material-ui/core/styles'

export const useStyles = makeStyles(
  (theme: Theme) => ({
    section: {
      marginBottom: theme.spacing(2),
      flexDirection: 'column',
      '&:hover': {
        cursor: 'pointer',
        backgroundColor: theme.palette.grey['100']
      }
    },
    header: {
      color: theme.palette.common.black,
      fontSize: theme.typography.subtitle2.fontSize,
      fontWeight: 700,
      textTransform: 'uppercase',
      lineHeight: 2,
      letterSpacing: '0.4px',
      ...theme.typography.subtitle2
    },
    container: {
      borderRadius: theme.shape.borderRadius,
      border: `1px solid ${theme.palette.action.disabledBackground}`,
      backgroundColor: theme.palette.background.paper
    },
    row: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: theme.spacing(1, 1),
      minHeight: '64px',
      transition: '0.1s ease-in background-color',
      maxWidth: '100%',
      overflow: 'hidden',
      borderBottom: `1px solid ${theme.palette.action.disabledBackground}`,
      '&:hover': {
        backgroundColor: theme.palette.grey[50]
      },
      '&:hover $actions': {
        opacity: 1
      },
      '&:first-child': {
        borderTopLeftRadius: theme.shape.borderRadius,
        borderTopRightRadius: theme.shape.borderRadius
      },
      '&:last-child': {
        borderBottom: 'none',
        borderBottomLeftRadius: theme.shape.borderRadius,
        borderBottomRightRadius: theme.shape.borderRadius
      }
    },
    title: {
      color: '#1D1F26', // TODO: use palette
      ...theme.typography.body2
    },
    time: {
      display: 'flex',
      alignItems: 'center',
      minWidth: '8rem',
      padding: theme.spacing(0, 1),
      color: theme.palette.grey[500],
      ...theme.typography.caption,
      lineHeight: 2
    },
    link: {
      cursor: 'pointer'
    },
    actions: {
      display: 'flex',
      alignItems: 'center',
      transition: '0.1s ease-in opacity',
      opacity: 0
    },
    iconNote: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: '2rem',
      height: '2rem',
      borderRadius: '100%',
      marginRight: '1rem',
      backgroundColor: alpha('#6A7589', 0.2)
    },
    zeroState: {
      marginTop: theme.spacing(16),
      textAlign: 'center'
    }
  }),
  { name: 'ContactProfileNotes' }
)
