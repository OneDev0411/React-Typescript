import React, { useState } from 'react'
import { Field } from 'react-final-form'
import { useSelector } from 'react-redux'
import { TextField } from '@material-ui/core'
import useEffectOnce from 'react-use/lib/useEffectOnce'
import Autocomplete, {
  createFilterOptions
} from '@material-ui/lab/Autocomplete'

import { getContactsTags } from 'models/contacts/get-contacts-tags'

import { IAppState } from 'reducers'
import { selectTags } from 'reducers/contacts/tags'

import { Container, Label } from 'components/final-form-fields/styled'

interface Option {
  inputValue?: string
  value?: string
  title: string
}

const filter = createFilterOptions<Option>({
  ignoreCase: true,
  trim: true
})

export function Tags() {
  const [tags, setTags] = useState<Option[]>([])
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

        setTags(normalizeTags(response.data))
      } catch (error) {
        console.log(error)
      }
    }

    if (existingTags.length === 0) {
      fetchTags()
    } else {
      setTags(normalizeTags(existingTags))
    }
  })

  return (
    <Container>
      <Label>Tags</Label>
      <Field
        name="tags"
        render={({ input }) => {
          return (
            <Autocomplete
              multiple
              freeSolo
              clearOnBlur
              selectOnFocus
              handleHomeEndKeys
              filterSelectedOptions
              options={tags}
              value={input.value}
              id="multiple-crm-tags"
              renderOption={option => option.title}
              renderInput={params => (
                <TextField {...params} placeholder="Type a tag name" />
              )}
              onChange={(event, value: Option[]) => {
                let newValue = [...value]

                if (newValue.length > 0) {
                  // get last item as new value
                  const lastValue: Option = newValue[newValue.length - 1]
                  let normalizedLastValue: Option | null = null

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

                input.onChange(newValue as any)
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
        }}
      />
    </Container>
  )
}
