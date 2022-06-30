import {
  Box,
  makeStyles,
  Button as DayButton,
  Theme,
  Typography
} from '@material-ui/core'
import { mdiCalendarOutline } from '@mdi/js'
import moment from 'moment'
import { DateRange } from 'react-day-picker-next'

import { BaseDropdown } from '@app/views/components/BaseDropdown'
import { RangeDayPicker } from '@app/views/components/DatePicker/next/RangeDayPicker'

import type { TasksListFilters } from '../context'

import { Button } from './components/Button'
import { ResetButton } from './components/ResetButton'

const useStyles = makeStyles(
  (theme: Theme) => ({
    root: {
      minWidth: '200px'
    },
    listItemIcon: {
      minWidth: theme.spacing(3)
    }
  }),
  {
    name: 'Tasks-Filters-DueDate'
  }
)

interface Props {
  currentFilters: TasksListFilters
  updateFilters: (filters: Partial<TasksListFilters>) => void
}

export function DueDateFilter({
  currentFilters: { startDueDate, endDueDate },
  updateFilters
}: Props) {
  const classes = useStyles()
  const hasDueDate = startDueDate || endDueDate

  const handleSelect = (range: DateRange) => {
    updateFilters({
      startDueDate: range.from,
      endDueDate: range.to
    })
  }

  return (
    <BaseDropdown
      renderDropdownButton={({ onClick, ref }) => (
        <Button
          title="Due Date"
          startIconPath={mdiCalendarOutline}
          isActive={!!hasDueDate}
          innerRef={ref}
          onClick={onClick}
        />
      )}
      renderMenu={({ close }) => (
        <div className={classes.root}>
          <Box p={2}>
            <Typography variant="subtitle1">Due Date</Typography>
          </Box>

          <DayButton
            variant="outlined"
            onClick={() =>
              updateFilters({
                startDueDate: moment().clone().startOf('isoWeek').toDate(),
                endDueDate: moment().clone().endOf('isoWeek').toDate()
              })
            }
          >
            This week
          </DayButton>
          <DayButton variant="outlined">Last week</DayButton>
          <div>
            <DayButton
              variant="outlined"
              onClick={() =>
                updateFilters({
                  startDueDate: moment().clone().startOf('month').toDate(),
                  endDueDate: moment().clone().endOf('month').toDate()
                })
              }
            >
              This Month
            </DayButton>
            <DayButton variant="outlined">Next Month</DayButton>
          </div>

          <div>
            <RangeDayPicker
              defaultValue={{
                from: startDueDate,
                to: endDueDate
              }}
              onSelect={handleSelect}
            />
          </div>
          {hasDueDate && (
            <ResetButton
              variant="text"
              onClick={() =>
                updateFilters({
                  startDueDate: undefined,
                  endDueDate: undefined
                })
              }
            />
          )}
        </div>
      )}
    />
  )
}
