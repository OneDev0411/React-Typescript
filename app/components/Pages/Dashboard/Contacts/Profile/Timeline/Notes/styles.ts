import { makeStyles, Theme } from '@material-ui/core'
import { alpha } from '@material-ui/core/styles'

export const useStyles = makeStyles(
  (theme: Theme) => ({
    section: {
      paddingLeft: theme.spacing(2),
      borderBottom: `1px solid ${theme.palette.action.disabledBackground}`
    },
    header: {
      display: 'flex',
      flexDirection: 'column',
      minWidth: theme.spacing(12),
      maxWidth: theme.spacing(12),
      paddingTop: theme.spacing(2),
      color: theme.palette.grey['900'],
      ...theme.typography.caption,
      lineHeight: 2
    },
    container: {
      '& $row:nth-child(even)': {
        backgroundColor: theme.palette.grey['50']
      }
    },
    row: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      padding: theme.spacing(2, 2),
      transition: '0.1s ease-in background-color',
      '&:hover $actions': {
        opacity: 1
      },
      '&:hover': {
        cursor: 'pointer',
        backgroundColor: theme.palette.grey['100']
      }
    },
    title: {
      color: '#1D1F26', // TODO: use palette
      ...theme.typography.body2
    },
    time: {
      minWidth: '5rem',
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
