import { createStyles, Theme } from '@material-ui/core'
import { fade } from '@material-ui/core/styles'

export const styles = (theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      justifyContent: 'center',
      width: '100%',
      minHeight: theme.spacing(8),
      position: 'relative',
      cursor: 'pointer',
      '&:hover': {
        backgroundColor: theme.palette.action.hover
      },
      '&:hover $actions': {
        opacity: 1
      },
      '& a, & button, & svg': {
        zIndex: 1,
        position: 'relative'
      }
    },
    dark: {
      backgroundColor: theme.palette.grey[50]
    },
    header: {
      display: 'flex',
      alignItems: 'flex-end',
      height: theme.spacing(8),
      marginBottom: theme.spacing(1),
      color: theme.palette.grey[700],
      ...theme.typography.body1
    },
    row: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: theme.spacing(0, 2),
      transition: '0.1s ease-in background-color',
      width: '100%'
    },
    container: {
      display: 'flex',
      alignItems: 'center',
      overflow: 'hidden'
    },
    title: {
      padding: theme.spacing(0.5, 0),
      color: '#1D1F26', // TODO: use palette
      ...theme.typography.body2
    },
    time: {
      minWidth: '5rem',
      color: theme.palette.grey[500],
      ...theme.typography.caption
    },
    link: {
      cursor: 'pointer'
    },
    buttonContainer: {
      position: 'absolute !important' as 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      width: '100%',
      height: '100%',
      opacity: 0,
      textIndent: '-11000px'
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
      backgroundColor: fade('#6A7589', 0.2)
    }
  })
