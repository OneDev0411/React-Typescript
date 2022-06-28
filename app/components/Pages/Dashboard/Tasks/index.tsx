import { useState } from 'react'

import { Box, TextField } from '@material-ui/core'

import PageLayout from '@app/views/components/GlobalPageLayout'

import { TasksListContext } from './context'
import { CreateTask } from './CreateTask'
import { TasksFilters } from './Filters'
import { TasksTable } from './Table'

export default function Tasks() {
  const [sortBy, setSortBy] = useState('-created_at')

  return (
    <TasksListContext.Provider value={{ sortBy, setSortBy }}>
      <PageLayout gutter={0}>
        <Box m={4}>
          <PageLayout.Header title="Tasks">
            <Box mr={1}>
              <TextField placeholder="Search" variant="outlined" size="small" />
            </Box>
            <CreateTask />
          </PageLayout.Header>
        </Box>

        <PageLayout.Main>
          <TasksFilters />
          <TasksTable />
        </PageLayout.Main>
      </PageLayout>
    </TasksListContext.Provider>
  )
}
