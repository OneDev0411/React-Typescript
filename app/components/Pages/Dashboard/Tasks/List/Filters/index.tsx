import { Box } from '@material-ui/core'

import { Filters } from '@app/views/components/Filters'

export interface TasksListFilters {
  assignee: any
}

export function TasksFilters() {
  return (
    <Box px={4} my={2}>
      <Filters<TasksListFilters>
        systemDefaultFilters={{
          assignee: []
        }}
        userFilters={{
          assignee: []
        }}
        onChange={filters => () => {}}
      >
        {(
          currentFilters,
          updateFilters,
          resetFilters,
          systemDefaultFilters
        ) => (
          <>
            <div>+++</div>
            <button type="button" onClick={resetFilters}>
              reset
            </button>
          </>
        )}
      </Filters>
    </Box>
  )
}
