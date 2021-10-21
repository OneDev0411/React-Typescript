import { ChangeEvent, useState } from 'react'

import { TextField } from '@material-ui/core'
import { Autocomplete, createFilterOptions } from '@material-ui/lab'

type Value = string | { label: string; value: string }

const filter = createFilterOptions<Value>()

interface SuperCampaignEnrolledParticipantsTagsProps {
  defaultValue: Nullable<string[]>
  options?: Nullable<string[]>
  onChange: (value: string[]) => void
  disabled: boolean
}

function SuperCampaignEnrolledParticipantsTags({
  defaultValue,
  options,
  onChange,
  disabled
}: SuperCampaignEnrolledParticipantsTagsProps) {
  const [selectedValue, setSelectedValue] = useState<string[]>(
    defaultValue ?? []
  )

  const handleChange = (_: ChangeEvent, values: Value[]) => {
    const finalValues = values.map(value => {
      if (typeof value === 'string') {
        return value
      }

      return value.value
    })

    const uniqueValues = [...new Set(finalValues)]

    setSelectedValue(uniqueValues)
    onChange(uniqueValues)
  }

  return (
    <Autocomplete<Value, true, true, true>
      multiple
      freeSolo
      clearOnBlur
      selectOnFocus
      disableClearable
      handleHomeEndKeys
      filterSelectedOptions
      options={options ?? []}
      value={selectedValue}
      onChange={handleChange}
      renderInput={params => (
        <TextField
          {...params}
          variant="filled"
          fullWidth
          size="small"
          placeholder="Search or create tags..."
        />
      )}
      disabled={disabled}
      filterOptions={(options, params) => {
        const filtered = filter(options, params)

        const { inputValue } = params

        // Suggest the creation of a new value
        const isExisting = [...options, ...selectedValue].some(option => {
          if (typeof option === 'string') {
            return inputValue === option
          }

          return inputValue === option.value
        })

        if (inputValue !== '' && !isExisting) {
          filtered.push({
            value: inputValue,
            label: `Add "${inputValue}"`
          })
        }

        return filtered
      }}
      getOptionLabel={option => {
        // regular option
        if (typeof option === 'string') {
          return option
        }

        // value selected with enter, right from the input
        return option.label
      }}
    />
  )
}

export default SuperCampaignEnrolledParticipantsTags
