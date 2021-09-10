import { makeStyles } from '@material-ui/core'

export const useStyles = makeStyles(
  theme => ({
    button: {
      padding: theme.spacing(1, 2),
      margin: theme.spacing(0, 0.5)
    },
    resetButton: {
      padding: theme.spacing(1, 2),
      margin: theme.spacing(0, 1, 0, 1.5)
    },
    filterButton: {
      minWidth: 170
    },
    editorRoot: {
      width: 350,
      padding: theme.spacing(2)
    },
    header: {
      marginBottom: theme.spacing(2)
    },
    title: {
      paddingLeft: theme.spacing(1)
    },
    switchControlLabel: {
      display: 'flex',
      justifyContent: 'space-between',
      flexDirection: 'row-reverse',
      width: '100%',
      margin: 0
    },
    subheader: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(1)
    },
    subtitle: {
      fontSize: theme.typography.subtitle2.fontSize,
      fontWeight: theme.typography.fontWeightBold
    },
    footer: {
      padding: theme.spacing(1, 2)
    },
    ToggleButtonGroup: { width: '100%' },
    ToggleButton: {
      flex: 1,
      '&.Mui-selected': {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText
      }
    }
  }),
  { name: 'PropertiesFilters' }
)
