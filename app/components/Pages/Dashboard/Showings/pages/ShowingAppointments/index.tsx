import { memo } from 'react'

import { useTitle } from 'react-use'

import { Box } from '@material-ui/core'

import { RouteComponentProps } from 'react-router'

import PageLayout from 'components/GlobalPageLayout'

import ShowingAppointmentList from '../../components/ShowingAppointmentList'

type ShowingAppointmentsProps = RouteComponentProps<
  {
    status?: IShowingAppointmentStatus
  },
  {}
>

function ShowingAppointments({ params }: ShowingAppointmentsProps) {
  useTitle('Appointment Status | Rechat')

  console.log('status', params.status)

  return (
    <PageLayout position="relative" overflow="hidden">
      <PageLayout.Header title="Appointment Status" />
      <PageLayout.Main>
        <Box my={3}>
          <ShowingAppointmentList />
        </Box>
      </PageLayout.Main>
    </PageLayout>
  )
}

export default memo(ShowingAppointments)
