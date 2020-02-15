import { createStyles, Theme, fade } from '@material-ui/core/styles'

export const sharedStyles = (theme: Theme) =>
  createStyles({
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
    emptyRowStyles: {
      alignItems: 'center',
      height: '100%',
      color: theme.palette.grey[600]
    }
  })
