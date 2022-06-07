import { useMemo } from 'react'

import { ContactTagSelectorForm } from '@app/components/Pages/Dashboard/Contacts/components/TagSelector'

import { InlineEditColumnsProps as TagsInlineEditProps } from './type'

export function TagsInlineEdit({
  contact,
  callback,
  close
}: TagsInlineEditProps) {
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

  const onSaveCallback = () => callback?.(contact.id)

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
