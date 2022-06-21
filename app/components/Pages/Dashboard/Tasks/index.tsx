import { Box } from '@material-ui/core'

import PageLayout from '@app/views/components/GlobalPageLayout'

import { CreateTask } from './CreateTask'
import { List } from './List'

export default function Tasks() {
  return (
    <PageLayout gutter={0}>
      <Box m={4}>
        <PageLayout.Header title="Tasks">
          <CreateTask />
        </PageLayout.Header>
      </Box>

      <PageLayout.Main>
        <Box my={2} px={2}>
          {/* --- Filters --- Filters --- Filters --- Filters --- Filters ---
          Filters --- Filters --- Filters --- */}
        </Box>
        <List />
      </PageLayout.Main>
    </PageLayout>
  )
}
