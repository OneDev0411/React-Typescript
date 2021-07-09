import {
  StepConnector as MUIStepConnector,
  withStyles,
  Theme
} from '@material-ui/core'

const StepConnector = withStyles(
  (theme: Theme) => ({
    root: {
      padding: 0,
      marginLeft: theme.spacing(3.25)
    },
    line: {
      borderLeftWidth: 3,
      borderColor: theme.palette.primary.main,
      minHeight: theme.spacing(10)
    }
  }),
  {
    name: 'ShowingAppointmentStatusStepConnector'
  }
)(MUIStepConnector)

export default StepConnector
