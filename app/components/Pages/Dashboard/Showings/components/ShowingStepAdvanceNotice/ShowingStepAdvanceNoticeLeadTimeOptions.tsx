import React from 'react'

import { Box } from '@material-ui/core'

import Select, { SelectItem } from 'components/Select'

import { hourToSeconds } from '../../helpers'

export const hourOptions: SelectItem<number>[] = new Array(12)
  .fill(null)
  .map((a, index) => ({
    label: `${index + 1} Hour${index > 0 ? 's' : ''}`,
    value: hourToSeconds(index + 1)
  }))

interface ShowingStepAdvanceNoticeLeadTimeOptionsProps {
  label?: string
  value: Nullable<number>
  onChange: (value: number) => void
}

function ShowingStepAdvanceNoticeLeadTimeOptions({
  label = 'Enter Lead Time',
  value,
  onChange
}: ShowingStepAdvanceNoticeLeadTimeOptionsProps) {
  return (
    <Box mb={1.5} mt={2} mx={1}>
      <Select<number>
        options={hourOptions}
        onChange={onChange}
        value={value ?? undefined}
        displayEmpty
        label={label}
      />
    </Box>
  )
}

export default ShowingStepAdvanceNoticeLeadTimeOptions
