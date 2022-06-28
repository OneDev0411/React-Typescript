import { useState } from 'react'

import { Box } from '@material-ui/core'

import PageLayout from '@app/views/components/GlobalPageLayout'

import { TasksListContext, TasksListFilters } from './context'
import { CreateTask } from './CreateTask'
import { TasksFilters } from './Filters'
import { TasksTable } from './Table'

export default function Tasks() {
  const [sortBy, setSortBy] = useState('-created_at')
  const [filter, setFilter] = useState<Partial<TasksListFilters>>({
    q: ''
  })

  return (
    <TasksListContext.Provider
      value={{
        sortBy,
        filter,
        setSortBy,
        setFilter: (data: Partial<TasksListFilters>) =>
          setFilter(filter => ({ ...filter, ...data }))
      }}
    >
      <PageLayout gutter={0}>
        <Box m={4}>
          <PageLayout.HeaderWithSearch
            title="Tasks"
            onSearch={value => setFilter(filter => ({ ...filter, q: value }))}
          >
            <Box ml={1}>
              <CreateTask />
            </Box>
          </PageLayout.HeaderWithSearch>
        </Box>

        <PageLayout.Main>
          <TasksFilters />
          <TasksTable />
        </PageLayout.Main>
      </PageLayout>
    </TasksListContext.Provider>
  )
}
