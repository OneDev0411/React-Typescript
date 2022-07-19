import React, { useState, useMemo } from 'react'

import {
  Typography,
  TextField,
  TextFieldProps,
  ChipProps
} from '@material-ui/core'
import Autocomplete, {
  createFilterOptions,
  AutocompleteRenderInputParams
} from '@material-ui/lab/Autocomplete'
import { useSelector } from 'react-redux'
import useEffectOnce from 'react-use/lib/useEffectOnce'

import { getContactsTags } from 'models/contacts/get-contacts-tags'
import { selectExistingTags } from 'selectors/contacts'

import { SelectorOption } from '../type'

import { normalizeTags, getTagKeys } from './utils'

const filter = createFilterOptions<SelectorOption>({
  ignoreCase: true,
  trim: true
})

export interface TagSelectorTextFieldProps {
  className?: string
  value?: SelectorOption[]
  chipProps?: ChipProps
  textFieldProps?: (
    params: AutocompleteRenderInputParams
  ) => Partial<TextFieldProps>
  onChange: (tags: SelectorOption[], hasNewTag: boolean) => void
  disabled?: boolean
}

export const TagSelectorTextField = ({
  className,
  value = [],
  onChange,
  chipProps = {},
  textFieldProps,
  disabled
}: TagSelectorTextFieldProps) => {
  const [selectedTags, setSelectedTags] = useState<SelectorOption[]>(value)
  const [availableTags, setAvailableTags] = useState<SelectorOption[]>([])
  const [availableTagKeys, setAvailableTagKeys] = useState<string[]>([])
  const existingTags = useSelector(selectExistingTags)
  const selectedTagKeys = useMemo(
    () => selectedTags.map(tag => tag.value?.toLowerCase()),
    [selectedTags]
  )

  useEffectOnce(() => {
    async function fetchTags() {
      try {
        const response = await getContactsTags()

        setAvailableTagKeys(getTagKeys(response.data))
        setAvailableTags(normalizeTags(response.data))
      } catch (error) {
        console.log(error)
      }
    }

    if (existingTags.length === 0) {
      fetchTags()
    } else {
      setAvailableTagKeys(getTagKeys(existingTags))
      setAvailableTags(normalizeTags(existingTags))
    }
  })

  const autocompleteOptions = useMemo(() => {
    const currentTags = selectedTags.map(tag => tag.title)

    return availableTags.filter(tag => !currentTags.includes(tag.title))
  }, [availableTags, selectedTags])

  return (
    <Autocomplete
      className={className}
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
      disabled={disabled}
      id="multiple-crm-tags"
      renderOption={option => (
        <Typography variant="body2">{option.title}</Typography>
      )}
      renderInput={params => (
        <TextField
          placeholder="Type a tag name"
          {...(textFieldProps ? textFieldProps(params) : params)}
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

          let tagValue = ''

          if (typeof lastValue === 'string') {
            const baseValue = (lastValue as string).trim()
            const originalTitle = availableTagKeys.indexOf(
              baseValue.toLowerCase()
            )

            tagValue =
              originalTitle >= 0
                ? availableTags[originalTitle].value!
                : baseValue
          } else if (lastValue && lastValue.value) {
            tagValue = lastValue.value
          }

          let normalizedLastValue: SelectorOption = {
            value: tagValue.trim(),
            title: tagValue.trim()
          }

          // Avoid processing an empty tag
          if (!normalizedLastValue.value) {
            return
          }

          if (
            /*
             we're doing ts-ignore because the type of event is set to
             ChangeEvent which keyCode doesn't exist there so
             it cause error but if user press some key like
             enter the keyCode value would be there in
             event object so we need for checking it
            */
            // @ts-ignore
            event.keyCode === 13 && // avoid set tag on enter if tag exist
            selectedTagKeys.includes(normalizedLastValue.value.toLowerCase())
          ) {
            return
          }

          if (hasNewTag) {
            setAvailableTagKeys([
              ...availableTagKeys,
              normalizedLastValue.value.toLowerCase()
            ])
          }

          newValues = [
            ...newValues.splice(0, newValues.length - 1),
            normalizedLastValue
          ]
        }

        setSelectedTags(newValues)
        onChange(newValues, hasNewTag)
      }}
      filterOptions={(options, params) => {
        const filtered = filter(options, params)

        const allTagKeys = [...availableTagKeys, ...selectedTagKeys]

        // Suggest the creation of a new value
        const sanitizedValue = params.inputValue.trim()

        if (
          sanitizedValue !== '' &&
          !allTagKeys.includes(sanitizedValue.toLowerCase())
        ) {
          filtered.push({
            value: sanitizedValue,
            title: `Add "${sanitizedValue}"`,
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
