import { createStyles, Theme } from '@material-ui/core'
import { fade } from '@material-ui/core/styles'

export const styles = (theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      justifyContent: 'center',
      height: theme.spacing(8),
      position: 'relative',
      cursor: 'pointer',
      '&:hover': {
        backgroundColor: theme.palette.action.hover
      },
      '& a, & button': {
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
      color: theme.palette.grey[700],
      fontSize: theme.typography.h6.fontSize
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
      alignItems: 'center'
    },
    title: {
      fontSize: '1rem',
      fontWeight: 500,
      color: '#1D1F26' // TODO: use palette
    },
    time: {
      width: '5rem',
      fontSize: '0.875rem',
      letterSpacing: '0.25px',
      color: theme.palette.grey[900]
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
      opacity: 0
    },
    icon: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '2rem',
      height: '2rem',
      borderRadius: '100%',
      marginRight: '1rem',
      backgroundColor: fade('#6A7589', 0.2)
    },
    iconEdit: {
      marginRight: theme.spacing(2),
      fill: theme.palette.grey[400]
    }
  })
