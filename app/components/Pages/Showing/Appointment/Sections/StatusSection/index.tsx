import { Grid } from '@material-ui/core'

import DetailsSection from '../../../Sections/DetailsSection'

import ShowingAppointmentStatusDetails from '../../Details'

interface Props {
  appointment: IPublicShowingAppointment<'showing'>
}

export default function ShowingAppointmentStatusSection({
  appointment
}: Props) {
  console.log({ appointment })

  return (
    <DetailsSection>
      <Grid item xs={12}>
        <ShowingAppointmentStatusDetails appointment={appointment} />
      </Grid>
    </DetailsSection>
  )
}
