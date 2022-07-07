import { Box, Typography } from '@material-ui/core'
import { mdiFormatListBulleted } from '@mdi/js'

import { BaseDropdown } from '@app/views/components/BaseDropdown'

import { TypesList } from '../components/TypesList'
import type { TasksListFilters } from '../context'

import { Button } from './components/Button'
import { ResetButton } from './components/ResetButton'

interface Props {
  currentFilters: TasksListFilters
  updateFilters: (filters: Partial<TasksListFilters>) => void
}

export function TypeFilter({ currentFilters: { type }, updateFilters }: Props) {
  return (
    <BaseDropdown
      renderDropdownButton={({ onClick, ref }) => (
        <Button
          title={type ?? 'Type'}
          startIconPath={mdiFormatListBulleted}
          isActive={!!type}
          innerRef={ref}
          onClick={onClick}
        />
      )}
      renderMenu={({ close }) => (
        <div>
          <Box p={2}>
            <Typography variant="subtitle1">Task Type</Typography>
          </Box>

          <TypesList
            selectedItem={type}
            onSelectItem={type => {
              close()
              setTimeout(() => updateFilters({ type }), 0)
            }}
          />

          {type && (
            <ResetButton
              variant="text"
              onClick={() =>
                updateFilters({
                  type: undefined
                })
              }
            />
          )}
        </div>
      )}
    />
  )
}
