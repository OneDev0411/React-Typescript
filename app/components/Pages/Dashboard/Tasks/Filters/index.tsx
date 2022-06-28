import { Box } from '@material-ui/core'

import { Filters } from '@app/views/components/Filters'

import type { TasksListFilters } from '../context'

import { AssigneeFilter } from './AssigneeFilter'
import { StatusFilter } from './StatusFilter'
import { TypeFilter } from './TypeFilter'

export function TasksFilters() {
  return (
    <Box px={4} my={2}>
      <Filters<TasksListFilters>
        systemDefaultFilters={{
          assignees: []
        }}
        userFilters={{
          assignees: []
        }}
        onChange={filters => () => {}}
      >
        {(
          currentFilters,
          updateFilters,
          resetFilters,
          systemDefaultFilters
        ) => (
          <Box display="flex">
            <Box mr={1}>
              <AssigneeFilter />
            </Box>

            <Box mr={1}>
              <StatusFilter />
            </Box>

            <Box mr={1}>
              <TypeFilter />
            </Box>
          </Box>
        )}
      </Filters>
    </Box>
  )
}
