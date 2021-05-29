import { makeStyles, Theme } from '@material-ui/core'

export const useStyles = makeStyles(
  (theme: Theme) => ({
    container: {
      display: 'flex',
      alignItems: 'center',
      flexGrow: 1,
      height: theme.spacing(8),
      paddingRight: theme.spacing(2),
      transition: '0.1s ease-in background-color',

      '&:hover': {
        backgroundColor: theme.palette.info.ultralight
      }
    },
    row: {
      width: '100%',
      paddingLeft: theme.spacing(3)
    },
    title: {
      margin: theme.spacing(0, 1),
      color: '#000',
      ...theme.typography.body2
    },
    subtitle: {
      color: theme.palette.grey['500'],
      ...theme.typography.subtitle3
    },
    date: {
      color: theme.palette.grey['700'],
      marginTop: theme.spacing(0.5),
      marginLeft: theme.spacing(1),
      ...theme.typography.caption
    },
    link: {
      color: '#000'
    },
    horizontalLine: {
      width: theme.spacing(3),
      height: '1px',
      borderBottom: `1px dashed ${theme.palette.grey['500']}`
    }
  }),
  {
    name: 'Deals-Checklist-TaskItems'
  }
)
