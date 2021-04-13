import React, { useState, useMemo } from 'react'
import { Box, Button, FormHelperText, Typography } from '@material-ui/core'

import ShowingAvailabilitiesTimesRow from './ShowingAvailabilitiesTimesRow'
import { hourToSeconds } from '../../helpers'
import { findSlotIndexById, findTimeConflicts } from './helpers'
import useQuestionWizardSmartNext from '../use-question-wizard-smart-next'

interface ShowingAvailabilitiesTimesProps {
  title?: string
  value: IShowingAvailabilityInput[]
  onChange: (value: IShowingAvailabilityInput[]) => void
}

function ShowingAvailabilitiesTimes({
  title = 'Available Times',
  value,
  onChange
}: ShowingAvailabilitiesTimesProps) {
  const nextStep = useQuestionWizardSmartNext()
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

  const handleContinue = () => {
    nextStep()
  }

  const timeConflicts = useMemo(() => findTimeConflicts(value), [value])

  return (
    <Box>
      <Typography variant="h6">{title}</Typography>
      <Box mt={3}>
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
      {timeConflicts && (
        <Box mb={1}>
          <FormHelperText error>The time slots has conflicts</FormHelperText>
        </Box>
      )}
      <Box display="flex" justifyContent="space-between" mt={5}>
        <Button variant="outlined" size="small" onClick={handleAdd}>
          + Add hour
        </Button>
        <Button
          variant="contained"
          size="small"
          color="primary"
          disabled={!value.length || !!timeConflicts}
          onClick={handleContinue}
        >
          Continue
        </Button>
      </Box>
    </Box>
  )
}

export default ShowingAvailabilitiesTimes
