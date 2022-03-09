import { makeStyles } from '@material-ui/core'

export const useStyles = makeStyles(
  theme => ({
    root: {
      display: 'flex',
      alignItems: 'center',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      marginTop: theme.spacing(-5),
      marginBottom: theme.spacing(1)
    },
    filtersWrapper: {
      display: 'flex',
      marginLeft: theme.spacing(-0.5),
      justifyContent: 'flex-start'
    },
    actionsWrapper: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
      marginRight: theme.spacing(-0.5),
      marginLeft: 'auto',
      alignItems: 'stretch'
    },
    button: {
      padding: theme.spacing(1, 2),
      margin: theme.spacing(0.5, 0.5)
    },
    buttonGroup: {
      '& > $button': {
        margin: theme.spacing(0.5, 0)
      },
      '& > $button:not(:last-of-type)': {
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
        borderRight: 'none'
      },
      '& > $button:not(:first-of-type)': {
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0
      },
      display: 'inline-flex',
      justifyContent: 'center',
      margin: theme.spacing(0, 0.5)
    },
    resetButton: {
      padding: theme.spacing(1, 2),
      margin: theme.spacing(0.5, 0.5)
    },
    exportButton: {
      padding: theme.spacing(1, 2),
      margin: theme.spacing(0.5, 0.5)
    },
    filterButton: {
      minWidth: 170
    },
    editorRoot: {
      width: 370,
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
    switchControlButton: {
      '& > .MuiSwitch-switchBase': {
        color: '#fff'
      },
      '& > .MuiSwitch-colorPrimary.Mui-checked': {
        color: theme.palette.primary.main
      }
    },
    editorGroup: {
      marginBottom: theme.spacing(2)
    },
    subheader: {
      fontSize: 14,
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1)
    },
    subtitle: {
      fontSize: theme.typography.subtitle2.fontSize,
      fontWeight: theme.typography.fontWeightBold
    },
    footer: {
      paddingTop: theme.spacing(1)
    },
    footerResetButton: {
      textAlign: 'left',
      justifyContent: 'flex-start',
      padding: 0,
      margin: 0,
      '&:hover, &:focus': {
        backgroundColor: 'transparent'
      }
    },
    ToggleButtonGroup: { width: '100%' },
    ToggleButton: {
      color: theme.palette.text.secondary
    },
    ToggleButtonSelected: {
      // !important is needed to fix MUI priority issue of CSS selector
      backgroundColor: `${theme.palette.primary.main} !important`,
      color: `${theme.palette.primary.contrastText} !important`,
      '&:hover': {
        backgroundColor: `${theme.palette.primary.dark} !important`
      }
    },
    fullToggleButton: {
      flex: 1
    },
    filledAutoCompleteWrapper: {
      flex: 1
    },
    to: {
      textAlign: 'center',
      padding: theme.spacing(2)
    },
    switchIcon: {
      fontSize: 14,
      marginRight: theme.spacing(0.5)
    },
    select: {
      width: '100%',
      marginBottom: theme.spacing(2)
    },
    subStatusGroup: {
      marginLeft: theme.spacing(3)
    },
    typeIcon: {
      color: theme.palette.primary.main
    },
    helpWrapper: {
      margin: theme.spacing(0, 2),
      alignItems: 'center',
      display: 'flex'
    }
  }),
  { name: 'AllDealsFilters' }
)
