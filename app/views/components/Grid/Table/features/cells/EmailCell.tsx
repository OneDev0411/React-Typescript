import AttributeCell from './types/AttributeCell'

interface Props {
  contact: IContact
  onSave?: (e: any) => void
  isRowSelected?: boolean
}

const EmailCell = ({ contact, isRowSelected = false }: Props) => {
  return (
    <AttributeCell
      attributes={contact.attributes || []}
      isRowSelected={isRowSelected}
      countEnabled
      attribute_type="email"
      attribute_label="Main"
    />
  )
}

export default EmailCell
