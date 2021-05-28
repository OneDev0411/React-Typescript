import React, { useState, useMemo, memo } from 'react'
import { Box, Button, Typography } from '@material-ui/core'

import ShowingAvailabilitiesTimesRow from './ShowingAvailabilitiesTimesRow'
import { hourToSeconds, findTimeConflicts } from '../../helpers'
import { findSlotIndexById } from './helpers'
import ShowingErrorText from '../ShowingErrorText'

export interface ShowingAvailabilitiesTimesProps {
  title?: string
  value: IShowingAvailabilityInput[]
  onChange: (value: IShowingAvailabilityInput[]) => void
  hasContinue?: boolean
  onContinue?: () => void
  error?: string
}

function ShowingAvailabilitiesTimes({
  title = 'Available Times',
  value,
  onChange,
  hasContinue = false,
  onContinue,
  error
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

  const handleChange = (id: UUID, row: IShowingAvailabilityInput) => {
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
            disableDelete={value.length < 2}
            hasError={
              timeConflicts &&
              (idx === timeConflicts.slot1Index ||
                idx === timeConflicts.slot2Index)
            }
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
            disabled={!value.length || !!timeConflicts || !!error}
            onClick={onContinue}
          >
            Continue
          </Button>
        )}
      </Box>
    </Box>
  )
}

export default memo(ShowingAvailabilitiesTimes)
