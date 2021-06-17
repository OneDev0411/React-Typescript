import React, { useState, useMemo } from 'react'
import { useSelector } from 'react-redux'
import {
  Typography,
  TextField,
  TextFieldProps,
  ChipProps
} from '@material-ui/core'
import useEffectOnce from 'react-use/lib/useEffectOnce'
import Autocomplete, {
  createFilterOptions
} from '@material-ui/lab/Autocomplete'

import { getContactsTags } from 'models/contacts/get-contacts-tags'
import { selectExistingTags } from 'selectors/contacts'

import { normalizeTags, getTagKeys } from './utils'
import { SelectorOption } from '../type'

const filter = createFilterOptions<SelectorOption>({
  ignoreCase: true,
  trim: true
})

export interface Props {
  value?: SelectorOption[]
  chipProps?: ChipProps
  textFiledProps?: TextFieldProps
  onChange: (tags: SelectorOption[], hasNewTag: boolean) => void
}

export const BaseTagSelector = ({
  value = [],
  onChange,
  chipProps = {},
  textFiledProps = {}
}: Props) => {
  const [selectedTags, setSelectedTags] = useState<SelectorOption[]>(value)
  const [availableTags, setAvailableTags] = useState<SelectorOption[]>([])
  const [tagKeys, setTagKeys] = useState<string[]>([])
  const existingTags = useSelector(selectExistingTags)

  useEffectOnce(() => {
    async function fetchTags() {
      try {
        const response = await getContactsTags()

        setTagKeys(getTagKeys(response.data))
        setAvailableTags(normalizeTags(response.data))
      } catch (error) {
        console.log(error)
      }
    }

    if (existingTags.length === 0) {
      fetchTags()
    } else {
      setTagKeys(getTagKeys(existingTags))
      setAvailableTags(normalizeTags(existingTags))
    }
  })

  const autocompleteOptions = useMemo(() => {
    const currentTags = selectedTags.map(tag => tag.title)

    return availableTags.filter(tag => !currentTags.includes(tag.title))
  }, [availableTags, selectedTags])

  return (
    <Autocomplete
      multiple
      freeSolo
      clearOnBlur
      selectOnFocus
      disableClearable
      handleHomeEndKeys
      filterSelectedOptions
      ChipProps={chipProps}
      options={autocompleteOptions}
      value={selectedTags}
      id="multiple-crm-tags"
      renderOption={option => (
        <Typography variant="body2">{option.title}</Typography>
      )}
      renderInput={params => (
        <TextField
          {...textFiledProps}
          {...params}
          placeholder="Type a tag name"
        />
      )}
      onChange={(event, value: SelectorOption[]) => {
        let newValues: SelectorOption[] = [...value]
        let hasNewTag = false

        if (newValues.length > 0) {
          // get last item as new value
          const lastValue: SelectorOption = newValues[newValues.length - 1]

          if (lastValue.isNewTag) {
            hasNewTag = true
          }

          let value = ''

          if (typeof lastValue === 'string') {
            value = (lastValue as string).trim()
          } else if (lastValue && lastValue.inputValue) {
            value = lastValue.inputValue.trim()
          }

          let normalizedLastValue: SelectorOption = {
            value,
            title: value
          }

          if (normalizedLastValue) {
            if (hasNewTag && normalizedLastValue.value) {
              setTagKeys([...tagKeys, normalizedLastValue.value])
            }

            newValues = [
              ...newValues.splice(0, newValues.length - 1),
              normalizedLastValue
            ]
          }
        }

        setSelectedTags(newValues)
        onChange(newValues, hasNewTag)
      }}
      filterOptions={(options, params) => {
        const filtered = filter(options, params)

        // Suggest the creation of a new value
        if (
          params.inputValue !== '' &&
          !tagKeys.includes(params.inputValue.trim().toLowerCase())
        ) {
          filtered.push({
            inputValue: params.inputValue,
            title: `Add "${params.inputValue}"`,
            isNewTag: true
          })
        }

        return filtered
      }}
      getOptionLabel={option => {
        // Value selected with enter, right from the input
        if (typeof option === 'string') {
          return option
        }

        // Add "xxx" option created dynamically
        if (option.inputValue) {
          return option.inputValue
        }

        // Regular option
        return option.title
      }}
    />
  )
}
