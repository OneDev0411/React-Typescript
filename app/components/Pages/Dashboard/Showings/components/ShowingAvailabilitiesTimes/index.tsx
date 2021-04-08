import React, { useState } from 'react'
import { Box, Button, Typography } from '@material-ui/core'

import ShowingAvailabilitiesTimesRow from './ShowingAvailabilitiesTimesRow'
import { hourToSeconds } from '../../helpers'
import { findSlotIndexById } from './helpers'
import useQuestionWizardSmartNext from '../use-question-wizard-smart-next'

interface ShowingAvailabilitiesTimesProps {
  title?: string
  value: IShowingAvailabilitySlot[]
  onChange: (value: IShowingAvailabilitySlot[]) => void
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

  const handleChange = (id: UUID, row: IShowingAvailabilitySlot) => {
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

  // TODO: we have to validate duplicated time slots. Also we need to check them
  // for time conflicts

  return (
    <Box>
      <Typography variant="h6">{title}</Typography>
      <Box mt={3}>
        {value.map(row => (
          <ShowingAvailabilitiesTimesRow
            key={row.id}
            {...row}
            onDelete={handleDelete}
            onChange={handleChange}
            disableDelete={value.length < 2}
          />
        ))}
      </Box>
      <Box display="flex" justifyContent="space-between" mt={5}>
        <Button variant="outlined" size="small" onClick={handleAdd}>
          + Add hour
        </Button>
        <Button
          variant="contained"
          size="small"
          color="primary"
          disabled={!value.length}
          onClick={nextStep}
        >
          Continue
        </Button>
      </Box>
    </Box>
  )
}

export default ShowingAvailabilitiesTimes
