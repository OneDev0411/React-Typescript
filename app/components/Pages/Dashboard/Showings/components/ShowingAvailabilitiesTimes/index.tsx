import { useState, useMemo, memo, ReactNode } from 'react'

import { Box, Button, Typography } from '@material-ui/core'

import { hourToSeconds, findTimeConflicts } from '../../helpers'
import { ShowingAvailabilityItem } from '../../types'
import ShowingErrorText from '../ShowingErrorText'

import { findSlotIndexById } from './helpers'
import ShowingAvailabilitiesTimesRow, {
  ShowingAvailabilitiesTimesRowProps
} from './ShowingAvailabilitiesTimesRow'

export interface ShowingAvailabilitiesTimesProps
  extends Pick<ShowingAvailabilitiesTimesRowProps, 'showingDuration'> {
  title?: string
  value: ShowingAvailabilityItem[]
  onChange: (value: ShowingAvailabilityItem[]) => void
  hasContinue?: boolean
  onContinue?: () => void
  error?: string
  children?: ReactNode
  disabledContinue?: boolean
}

function ShowingAvailabilitiesTimes({
  title = 'Available Times',
  value,
  onChange,
  hasContinue = false,
  onContinue,
  error,
  children,
  showingDuration,
  disabledContinue = false
}: ShowingAvailabilitiesTimesProps) {
  const [nextId, setNextId] = useState(0)

  const getNextId = () => {
    setNextId(nextId + 1)

    return `tmp${nextId}`
  }

  const handleAdd = () => {
    onChange([
      ...value,
      {
        id: getNextId(),
        weekday: 'Monday',
        availability: [hourToSeconds(9), hourToSeconds(17)]
      }
    ])
  }

  const handleChange = (id: UUID, row: ShowingAvailabilityItem) => {
    const index = findSlotIndexById(value, id)

    if (index === -1) {
      return
    }

    const newValue = [...value]

    newValue.splice(index, 1, row)

    onChange(newValue)
  }

  const handleDelete = (id: UUID) => {
    const index = findSlotIndexById(value, id)

    if (index === -1) {
      return
    }

    const newValue = [...value]

    newValue.splice(index, 1)

    onChange(newValue)
  }

  const handleInsert = (idx: number) => {
    const newValue = [...value]

    newValue.splice(idx + 1, 0, {
      id: getNextId(),
      weekday: value[idx].weekday || 'Monday',
      availability: [hourToSeconds(9), hourToSeconds(17)]
    })

    onChange(newValue)
  }

  const timeConflicts = useMemo(() => findTimeConflicts(value), [value])

  return (
    <Box width="100%">
      <Typography variant="h6">{title}</Typography>
      <Box mt={1}>
        {value.map((row, idx) => (
          <ShowingAvailabilitiesTimesRow
            key={row.id}
            {...row}
            onDelete={handleDelete}
            onChange={handleChange}
            onInsert={() => handleInsert(idx)}
            disableDelete={value.length < 2}
            hasError={timeConflicts.includes(idx)}
            hasInsertButton={idx !== value.length - 1}
            showingDuration={showingDuration}
          />
        ))}
      </Box>
      {error && (
        <Box mt={1}>
          <ShowingErrorText>{error}</ShowingErrorText>
        </Box>
      )}
      <Box display="flex" justifyContent="space-between" mt={5}>
        <Button variant="outlined" size="small" onClick={handleAdd}>
          + Add hour
        </Button>
        {hasContinue && (
          <Button
            variant="contained"
            size="small"
            color="primary"
            disabled={
              value.length === 0 ||
              timeConflicts.length > 0 ||
              !!error ||
              disabledContinue
            }
            onClick={onContinue}
          >
            Continue
          </Button>
        )}
        {children}
      </Box>
    </Box>
  )
}

export default memo(ShowingAvailabilitiesTimes)
