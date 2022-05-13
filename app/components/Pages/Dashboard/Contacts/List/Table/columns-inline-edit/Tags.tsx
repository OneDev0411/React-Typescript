import { useMemo } from 'react'

import { useDispatch } from 'react-redux'

import { getContact } from '@app/models/contacts/get-contact'
import { updateContactTags } from 'actions/contacts/update-contact-tags'
import { TagSelectorForm, SelectorOption } from 'components/TagSelector'

interface Props {
  contact: IContact
  isParkTabActive?: boolean
  reloadContacts?: () => void
  close: () => void
}

export function TagsInlineEdit({
  close,
  contact,
  reloadContacts,
  isParkTabActive = false
}: Props) {
  const dispatch = useDispatch()

  const currentTags = useMemo(
    () =>
      (contact?.tags || []).map(tag => {
        return {
          title: tag,
          value: tag
        }
      }),
    [contact?.tags]
  )

  const handleSave = async (tags: SelectorOption[] = []) => {
    try {
      if (isParkTabActive || tags.length === 0) {
        return reloadContacts?.()
      }

      const response = await getContact(contact.id, {
        associations: []
      })
      const newTags = response.data?.tags ?? []

      dispatch(updateContactTags(contact.id, newTags))
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <TagSelectorForm
      showManageTags
      label={`${contact.display_name}'s Tag`}
      value={currentTags}
      onSave={handleSave}
      onCancel={close}
    />
  )
}
