import { useDispatch } from 'react-redux'

import { bulkTag } from '@app/models/contacts/bulk-tag'
import {
  generateContactFilters,
  ContactFilterGenerator
} from '@app/models/contacts/bulk-tag/utils/generate-contact-filters'
import { getContactsTags } from '@app/store_actions/contacts'
import {
  SelectorOption,
  TagSelectorForm,
  TagSelectorFormProps
} from '@app/views/components/TagSelector'

export interface ContactTagSelectorFormProps
  extends Omit<TagSelectorFormProps, 'onSave'> {
  filter: ContactFilterGenerator
}

export const ContactTagSelectorForm = ({
  filter,
  ...props
}: ContactTagSelectorFormProps) => {
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

  return <TagSelectorForm {...props} onSave={handleSave} />
}
