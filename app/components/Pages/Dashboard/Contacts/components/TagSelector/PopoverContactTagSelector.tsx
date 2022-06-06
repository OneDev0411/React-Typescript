import { useDispatch } from 'react-redux'

import { bulkTag } from '@app/models/contacts/bulk-tag'
import {
  generateContactFilters,
  ContactFilterGenerator
} from '@app/models/contacts/bulk-tag/utils/generate-contact-filters'
import { getContactsTags } from '@app/store_actions/contacts'
import {
  SelectorOption,
  PopoverTagSelector,
  PopoverTagSelectorProps
} from '@app/views/components/TagSelector'

export interface PopoverContactTagSelectorProps
  extends Omit<PopoverTagSelectorProps, 'onSave'> {
  filter: ContactFilterGenerator
}

export const PopoverContactTagSelector = ({
  filter,
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
  }

  return <PopoverTagSelector {...props} onSave={handleSave} />
}
