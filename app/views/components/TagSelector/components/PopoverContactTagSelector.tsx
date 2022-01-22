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
  extends Omit<PopoverTagSelectorProps, 'onSave'> {
  filter: ContactFilterGenerator
  onSaveCallback?: PopoverTagSelectorProps['onSave']
}

export const PopoverContactTagSelector = ({
  filter,
  onSaveCallback,
  ...props
}: PopoverContactTagSelectorProps) => {
  const dispatch = useDispatch()

  const handleSave = async (
    selectedTags: SelectorOption[],
    hasNewTag: boolean
  ) => {
    try {
      const tags = selectedTags.map(tag => tag.title)
      const bulkFilter = generateContactFilters(filter)

      await bulkTag(tags, bulkFilter)

      if (hasNewTag) {
        dispatch(getContactsTags())
      }
    } catch (err) {
      console.error(err)
    }

    return onSaveCallback?.(selectedTags, hasNewTag)
  }

  return <PopoverTagSelector {...props} onSave={handleSave} />
}
