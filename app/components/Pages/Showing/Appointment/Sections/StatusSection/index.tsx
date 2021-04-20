import {
  Grid,
  Box,
  Divider,
  // Typography,
  // Paper,
  // Button,
  // TextField,
  Hidden,
  makeStyles,
  Theme
} from '@material-ui/core'

import ShowingAppointmentTimeline from './Timeline'

const useStyles = makeStyles(
  (theme: Theme) => ({
    container: {
      [theme.breakpoints.down('xs')]: {
        padding: theme.spacing(0, 2, 8)
      },
      [theme.breakpoints.up('sm')]: {
        padding: theme.spacing(3, 8)
      }
    },
    logo: {
      height: theme.spacing(3)
    }
  }),
  {
    name: 'ShowingAppointmentStatusSection'
  }
)

interface Props {
  appointment: IPublicShowingAppointment<'showing'>
}

export default function ShowingAppointmentStatusSection({
  appointment
}: Props) {
  console.log({ appointment })

  const classes = useStyles()

  return (
    <Grid item xs={12} sm={6} md={7} className={classes.container}>
      <Hidden xsDown>
        <Grid item xs={4} sm={2}>
          <Box pb={2}>
            <img
              className={classes.logo}
              alt="logo"
              src="/static/images/logo.svg"
            />
          </Box>
        </Grid>
      </Hidden>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid item xs={12}>
        <ShowingAppointmentTimeline appointment={appointment} />
      </Grid>
    </Grid>
  )
}
