import { AttributeCell } from './types/AttributeCell'

interface Props {
  contact: IContact
  onSave?: (e: any) => void
  isRowSelected?: boolean
  width: number | string
}

export const EmailCell = ({ contact, isRowSelected = false, width }: Props) => {
  return (
    <AttributeCell
      attributes={contact.attributes || []}
      isRowSelected={isRowSelected}
      countEnabled
      attribute_type="email"
      attribute_label="Main"
      width={width}
    />
  )
}
