import { memo } from 'react'

import { useTitle } from 'react-use'

import { Box } from '@material-ui/core'

import PageLayout from 'components/GlobalPageLayout'

// import BoxWithTitle from '../../components/BoxWithTitle'
// import ShowingAppointmentList from '../../components/ShowingAppointmentList'

import ShowingPropertyList from '../../components/ShowingPropertyList'

function Showings() {
  useTitle('Showings | Rechat')

  return (
    <PageLayout position="relative" overflow="hidden">
      <PageLayout.Header title="Showings" />
      <PageLayout.Main>
        <Box my={3}>
          <ShowingPropertyList />
          {/* <BoxWithTitle
            title="Upcoming Booking Appointment"
            viewLink="/dashboard/showings/list"
          >
            <ShowingAppointmentList />
          </BoxWithTitle> */}
        </Box>
      </PageLayout.Main>
    </PageLayout>
  )
}

export default memo(Showings)
