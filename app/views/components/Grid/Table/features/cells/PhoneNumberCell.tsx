import { formatPhoneNumber } from '@app/utils/format'

import { AttributeCell } from './types/AttributeCell'

interface Props {
  contact: IContact
  onSave?: (e: any) => void
  isRowSelected?: boolean
}

export const PhoneNumberCell = ({ contact, isRowSelected = false }: Props) => {
  return (
    <AttributeCell
      attributes={contact.attributes || []}
      isRowSelected={isRowSelected}
      countEnabled
      attribute_type="phone_number"
      attribute_label="Main"
      valueFormatter={formatPhoneNumber}
    />
  )
}
