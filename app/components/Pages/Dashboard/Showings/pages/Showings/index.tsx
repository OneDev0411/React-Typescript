import { memo } from 'react'

import { useTitle } from 'react-use'

import { Box } from '@material-ui/core'

import PageLayout from 'components/GlobalPageLayout'

import BoxWithTitle from '../../components/BoxWithTitle'
import ShowingAppointmentList from '../../components/ShowingAppointmentList'

function Showings() {
  useTitle('Showings | Rechat')

  return (
    <PageLayout position="relative" overflow="hidden">
      <PageLayout.Header title="Showings" />
      <PageLayout.Main>
        <Box my={3}>
          <BoxWithTitle
            title="Upcoming Booking Appointment"
            viewLink="/dashboard/showings/list"
          >
            <ShowingAppointmentList />
          </BoxWithTitle>
        </Box>
      </PageLayout.Main>
    </PageLayout>
  )
}

export default memo(Showings)
