import { memo, useMemo } from 'react'

import AttributeCell from './types/AttributeCell'

interface Props {
  contact: IContact
  onSave?: (e: any) => void
  isRowSelected?: boolean
}

const PhoneNumberCell = ({ contact, isRowSelected = false }: Props) => {
  const attributes: IContactAttribute[] = useMemo(
    () => contact?.attributes || [],
    [contact?.attributes]
  )

  return (
    <AttributeCell
      countEnabled
      attributes={attributes}
      isRowSelected={isRowSelected}
      attributeInputPlaceholder="(123) 456 - 7890"
      attributeDescription="Phone Number"
      attributeType="phone_number"
      attributeLabel="Main"
    />
  )
}

export default memo(PhoneNumberCell)
