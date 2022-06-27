import { useState } from 'react'

import { TasksListContext } from './context'
import { TasksFilters } from './Filters'
import { TasksTable } from './Table'

export function List() {
  const [sortBy, setSortBy] = useState('-created_at')

  return (
    <TasksListContext.Provider value={{ sortBy, setSortBy }}>
      <TasksFilters />
      <TasksTable />
    </TasksListContext.Provider>
  )
}
