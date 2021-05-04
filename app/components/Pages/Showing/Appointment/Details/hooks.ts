import { makeStyles, Theme } from '@material-ui/core'

export const useShowingAppointmentStatusDetailsStyles = makeStyles(
  (theme: Theme) => ({
    stepper: {
      padding: 0,
      marginTop: theme.spacing(6)
    },
    stepIconContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: theme.spacing(7),
      height: theme.spacing(7),
      marginRight: theme.spacing(1),
      borderRadius: '50%',
      border: `1px solid ${theme.palette.primary.main}`
    },
    activeStepIconContainer: {
      backgroundColor: theme.palette.primary.main
    },
    stepLabel: {
      alignItems: 'flex-start'
    },
    stepContent: {
      margin: theme.spacing(2, 0, 0, 9),
      paddingLeft: 0
    }
  }),
  {
    name: 'ShowingAppointmentStatusDetailsCommon'
  }
)
