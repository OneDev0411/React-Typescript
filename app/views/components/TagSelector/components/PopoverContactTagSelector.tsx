import { useState } from 'react'

import { useDispatch } from 'react-redux'

import { getContactsTags } from 'actions/contacts'
import { bulkTag } from 'models/contacts/bulk-tag'
import {
  generateContactFilters,
  ContactFilterGenerator
} from 'models/contacts/bulk-tag/utils/generate-contact-filters'

import { SelectorOption } from '../type'

import {
  PopoverTagSelector,
  PopoverTagSelectorProps
} from './PopoverTagSelector'

export interface PopoverContactTagSelectorProps
  extends Omit<
    PopoverTagSelectorProps,
    'onSave' | 'saveButtonDisabled' | 'saveButtonDisabled'
  > {
  filter: ContactFilterGenerator
  onSave?: PopoverTagSelectorProps['onSave']
}

export const PopoverContactTagSelector = ({
  filter,
  onChange,
  onSave,
  ...props
}: PopoverContactTagSelectorProps) => {
  const dispatch = useDispatch()
  const [hasNewTag, setHasNewTag] = useState<boolean>(false)
  const [isSaving, setIsSaving] = useState<boolean>(false)

  const handleChange = (tags: SelectorOption[], newTag: boolean) => {
    if (newTag !== hasNewTag) {
      setHasNewTag(newTag)
    }

    onChange?.(tags, newTag)
  }

  const handleSave = async (selectedTags: SelectorOption[]) => {
    try {
      setIsSaving(true)

      const tags = selectedTags.map(tag => tag.title)
      const bulkFilter = generateContactFilters(filter)

      await bulkTag(tags, bulkFilter)

      if (hasNewTag) {
        dispatch(getContactsTags())
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsSaving(false)
    }

    return onSave?.(selectedTags)
  }

  return (
    <PopoverTagSelector
      {...props}
      onChange={handleChange}
      onSave={handleSave}
      saveButtonDisabled={isSaving}
      saveButtonLabel={isSaving ? 'Save' : 'Done'}
    />
  )
}
