import { memo } from 'react'

import { useTitle } from 'react-use'

import { Box } from '@material-ui/core'

import PageLayout from 'components/GlobalPageLayout'

import ShowingPropertyList from '../../components/ShowingPropertyList'
import ShowingAppointmentUpdates from '../../components/ShowingAppointmentUpdates'

function Showings() {
  useTitle('Showings | Rechat')

  return (
    <PageLayout position="relative" overflow="hidden">
      <PageLayout.Header title="Showings" />
      <PageLayout.Main>
        <Box my={3}>
          <Box mb={5}>
            <ShowingAppointmentUpdates />
          </Box>
          <ShowingPropertyList />
        </Box>
      </PageLayout.Main>
    </PageLayout>
  )
}

export default memo(Showings)
