import React, { useState, useMemo } from 'react'
import { Box, Button, FormHelperText, Typography } from '@material-ui/core'

import ShowingAvailabilitiesTimesRow from './ShowingAvailabilitiesTimesRow'
import {
  hourToSeconds,
  findTimeConflicts,
  hasInvalidTimeRange
} from '../../helpers'
import { findSlotIndexById } from './helpers'
import useQuestionWizardSmartNext from '../../hooks/use-question-wizard-smart-next'
import useIsQuestionWizardCurrentStep from '../../hooks/use-is-question-wizard-current-step'

export interface ShowingAvailabilitiesTimesProps {
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
  const isCurrentStep = useIsQuestionWizardCurrentStep()
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
  const hasInvalidRange = useMemo(() => hasInvalidTimeRange(value), [value])

  return (
    <Box>
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
      {timeConflicts && isCurrentStep && (
        <Box mb={1}>
          <FormHelperText error>The time slots has conflicts</FormHelperText>
        </Box>
      )}
      <Box display="flex" justifyContent="space-between" mt={5}>
        <Button variant="outlined" size="small" onClick={handleAdd}>
          + Add hour
        </Button>
        {isCurrentStep && (
          <Button
            variant="contained"
            size="small"
            color="primary"
            disabled={!value.length || !!timeConflicts || hasInvalidRange}
            onClick={handleContinue}
          >
            Continue
          </Button>
        )}
      </Box>
    </Box>
  )
}

export default ShowingAvailabilitiesTimes
