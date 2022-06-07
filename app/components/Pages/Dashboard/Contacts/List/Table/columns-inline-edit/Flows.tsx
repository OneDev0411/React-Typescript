import AddToFlowForm from '@app/views/components/AddToFlowForm'

import { InlineEditColumnsProps as FlowsInlineEditProps } from './type'

export function FlowsInlineEdit({
  contact,
  callback,
  close
}: FlowsInlineEditProps) {
  const onSaveCallback = () => callback?.(contact.id)

  return (
    <AddToFlowForm
      isOpen
      callback={onSaveCallback}
      contacts={{ ids: [contact.id] }}
      handleClose={close}
    />
  )
}
