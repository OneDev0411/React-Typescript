import { Box } from '@material-ui/core'

import { Filters } from '@app/views/components/Filters'

import type { TasksListFilters } from '../context'
import { useTasksListContext } from '../context/use-tasks-list-context'

import { AssigneeFilter } from './AssigneeFilter'
import { DueDateFilter } from './DueDateFilter'
import { StatusFilter } from './StatusFilter'
import { TypeFilter } from './TypeFilter'

export function TasksFilters() {
  const { filter, setFilter } = useTasksListContext()

  return (
    <Box px={4} mb={2}>
      <Filters<TasksListFilters>
        systemDefaultFilters={filter}
        userFilters={filter}
        onChange={setFilter}
      >
        {(currentFilters, updateFilters) => (
          <Box display="flex">
            <Box mr={1}>
              <AssigneeFilter
                currentFilters={currentFilters}
                updateFilters={updateFilters}
              />
            </Box>

            <Box mr={1}>
              <StatusFilter
                currentFilters={currentFilters}
                updateFilters={updateFilters}
              />
            </Box>

            <Box mr={1}>
              <TypeFilter
                currentFilters={currentFilters}
                updateFilters={updateFilters}
              />
            </Box>

            <Box mr={1}>
              <DueDateFilter
                currentFilters={currentFilters}
                updateFilters={updateFilters}
              />
            </Box>
          </Box>
        )}
      </Filters>
    </Box>
  )
}
