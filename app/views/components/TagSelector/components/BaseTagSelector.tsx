import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { TextField, TextFieldProps, ChipProps } from '@material-ui/core'
import useEffectOnce from 'react-use/lib/useEffectOnce'
import Autocomplete, {
  createFilterOptions
} from '@material-ui/lab/Autocomplete'

import { getContactsTags } from 'models/contacts/get-contacts-tags'

import { IAppState } from 'reducers'
import { selectTags } from 'reducers/contacts/tags'

import { SelectorOption } from '../type'

const filter = createFilterOptions<SelectorOption>({
  ignoreCase: true,
  trim: true
})

export interface Props {
  value?: SelectorOption[]
  chipProps?: ChipProps
  textFiledProps?: TextFieldProps
  onChange: (tags: SelectorOption[]) => void
}

export const BaseTagSelector = ({
  value = [],
  onChange,
  chipProps = {},
  textFiledProps = {}
}: Props) => {
  const [selectedTags, setSelectedTags] = useState<SelectorOption[]>(value)
  const [availableTags, setAvailableTags] = useState<SelectorOption[]>([])
  const { existingTags } = useSelector((store: IAppState) => ({
    existingTags: selectTags(store.contacts.tags)
  }))

  useEffectOnce(() => {
    const normalizeTags = tags =>
      tags.map(tag => ({
        value: tag.tag,
        title: tag.text
      }))

    async function fetchTags() {
      try {
        const response = await getContactsTags()

        setAvailableTags(normalizeTags(response.data))
      } catch (error) {
        console.log(error)
      }
    }

    if (existingTags.length === 0) {
      fetchTags()
    } else {
      setAvailableTags(normalizeTags(existingTags))
    }
  })

  // useEffect(() => {
  //   console.log('use effect in base')
  //   setSelectedTags(value)
  //   onChange(value)
  // }, [onChange, value])

  return (
    <Autocomplete
      multiple
      freeSolo
      clearOnBlur
      selectOnFocus
      handleHomeEndKeys
      filterSelectedOptions
      ChipProps={chipProps}
      options={availableTags}
      value={selectedTags}
      id="multiple-crm-tags"
      renderOption={option => option.title}
      renderInput={params => (
        <TextField
          {...textFiledProps}
          {...params}
          placeholder="Type a tag name"
        />
      )}
      onChange={(event, value: SelectorOption[]) => {
        let newValue: SelectorOption[] = [...value]

        if (newValue.length > 0) {
          // get last item as new value
          const lastValue: SelectorOption = newValue[newValue.length - 1]
          let normalizedLastValue: SelectorOption | null = null

          if (typeof lastValue === 'string') {
            normalizedLastValue = {
              value: lastValue,
              title: lastValue
            }
          } else if (lastValue && lastValue.inputValue) {
            // Create a new value from the user input
            normalizedLastValue = {
              value: lastValue.inputValue,
              title: lastValue.inputValue
            }
          }

          if (normalizedLastValue) {
            newValue = [
              ...newValue.splice(0, newValue.length - 1),
              normalizedLastValue
            ]
          }
        }

        setSelectedTags(newValue)
        onChange(newValue)
      }}
      filterOptions={(options, params) => {
        const filtered = filter(options, params)

        // Suggest the creation of a new value
        if (params.inputValue !== '' && filtered.length === 0) {
          filtered.push({
            inputValue: params.inputValue,
            title: `Add "${params.inputValue}"`
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
