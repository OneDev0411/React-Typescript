import AttributeCell from './types/AttributeCell'

interface Props {
  contact: IContact
  onSave?: (e: any) => void
  isRowSelected?: boolean
}

const PhoneNumberCell = ({ contact, isRowSelected = false }: Props) => {
  return (
    <AttributeCell
      contact={contact}
      isRowSelected={isRowSelected}
      countEnabled
      attribute_type="phone_number"
      attribute_label="Main"
    />
  )
}

export default PhoneNumberCell
