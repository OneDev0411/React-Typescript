import AddToFlowForm from '@app/views/components/AddToFlowForm'

interface Props {
  contact: IContact
  close: () => void
  callback?: () => void
}

export function FlowsInlineEdit({ contact, callback, close }: Props) {
  return (
    <AddToFlowForm
      isOpen
      callback={callback}
      contacts={{ ids: [contact.id] }}
      handleClose={close}
    />
  )
}
