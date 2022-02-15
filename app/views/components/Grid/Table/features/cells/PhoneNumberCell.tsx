import { formatPhoneNumber } from '@app/utils/format'

import { AttributeCell } from './types/AttributeCell'

interface Props {
  contact: IContact
  onSave?: (e: any) => void
  isRowSelected?: boolean
  width: number | string
}

export const PhoneNumberCell = ({
  contact,
  isRowSelected = false,
  width
}: Props) => {
  return (
    <AttributeCell
      attributes={contact.attributes || []}
      isRowSelected={isRowSelected}
      countEnabled
      width={width}
      attribute_type="phone_number"
      attribute_label="Main"
      valueFormatter={formatPhoneNumber}
    />
  )
}
