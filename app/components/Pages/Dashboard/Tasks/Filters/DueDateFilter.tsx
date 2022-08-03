import { useMemo, useState } from 'react'

import { Box, makeStyles, Theme, Typography, MenuItem } from '@material-ui/core'
import { mdiCalendarOutline } from '@mdi/js'
import moment from 'moment'
import { DateRange } from 'react-day-picker-next'

import { getDateRanges } from '@app/utils/get-date-ranges'
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
  currentFilters: { dueDate },
  updateFilters
}: Props) {
  const classes = useStyles()
  const [showCustomRange, setShowCustomRange] = useState(false)

  const hasDueDate = dueDate?.from || dueDate?.to

  const dates = useMemo(getDateRanges, [])
  const currentDue = useMemo(
    () =>
      Object.values(dates).find(
        date => dueDate?.from === date.from && dueDate?.to === date.to
      ),
    [dates, dueDate?.from, dueDate?.to]
  )

  const getTitle = () => {
    if (showCustomRange) {
      return `Due from ${moment(dueDate?.from).format(
        'dddd, MMMM DD'
      )} to ${moment(dueDate?.to).format('dddd, MMMM DD')}`
    }

    if (currentDue) {
      return `Due ${currentDue.label}`
    }

    return 'Due Date'
  }

  const handleSelectDate = (range: DateRange) => {
    updateFilters({
      dueDate: range
    })
  }

  return (
    <BaseDropdown
      renderDropdownButton={({ onClick, ref }) => (
        <Button
          text={getTitle()}
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

          {showCustomRange ? (
            <RangeDayPicker onSelect={handleSelectDate} />
          ) : (
            <>
              {Object.entries(dates).map(([name, date]) => (
                <MenuItem
                  key={name}
                  button
                  selected={
                    dueDate?.from === date.from && dueDate?.to === date.to
                  }
                  onClick={() => {
                    close()

                    handleSelectDate({
                      from: date.from,
                      to: date.to
                    })
                  }}
                >
                  {date.label}
                </MenuItem>
              ))}

              <MenuItem
                button
                selected={showCustomRange}
                onClick={() => setShowCustomRange(true)}
              >
                Custom Range
              </MenuItem>
            </>
          )}

          {(hasDueDate || showCustomRange) && (
            <ResetButton
              variant="text"
              onClick={() => {
                close()
                setShowCustomRange(false)
                updateFilters({
                  dueDate: undefined
                })
              }}
            />
          )}
        </div>
      )}
    />
  )
}
