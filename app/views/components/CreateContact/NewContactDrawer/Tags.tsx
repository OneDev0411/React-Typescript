import React, { useState } from 'react'
import { Field } from 'react-final-form'
import { useSelector } from 'react-redux'
import { TextField } from '@material-ui/core'
import useEffectOnce from 'react-use/lib/useEffectOnce'
import Autocomplete from '@material-ui/lab/Autocomplete'

import { getContactsTags } from 'models/contacts/get-contacts-tags'

import { IAppState } from 'reducers'
import { selectTags } from 'reducers/contacts/tags'

import { Container, Label } from 'components/final-form-fields/styled'

interface Tag {
  tag: string
  text: string
}

export function Tags() {
  const [tags, setTags] = useState<Tag[]>([])
  const { existingTags } = useSelector((store: IAppState) => ({
    existingTags: selectTags(store.contacts.tags)
  }))

  useEffectOnce(() => {
    const normalizeTags = tags =>
      tags.map(tag => ({
        tag: tag.tag,
        text: tag.text
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
              options={tags}
              id="multiple-crm-tags"
              value={input.value}
              onChange={(event, tag) => input.onChange(tag as any)}
              getOptionLabel={option => option.text}
              renderInput={params => (
                <TextField {...params} placeholder="Type a tag name" />
              )}
            />
          )
        }}
      />
    </Container>
  )
}
