import { useMemo } from 'react'

import { useDispatch } from 'react-redux'

import { ContactTagSelectorForm } from '@app/components/Pages/Dashboard/Contacts/components/TagSelector'
import { getContact } from '@app/models/contacts/get-contact'
import { updateContactTags } from '@app/store_actions/contacts/update-contact-tags'
import { SelectorOption } from 'components/TagSelector'

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

  const onSaveCallback = async (tags: SelectorOption[] = []) => {
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
    <ContactTagSelectorForm
      showManageTags
      label={`${contact.display_name}'s Tag`}
      value={currentTags}
      onCancel={close}
      callback={onSaveCallback}
      filter={{
        selectedIds: [contact.id]
      }}
    />
  )
}
