import { memo, useMemo } from 'react'

import { formatPhoneNumber } from '@app/utils/format'

import { AttributeCell } from './types/AttributeCell'

interface Props {
  contact: IContact
  onSave?: (e: any) => void
  isRowSelected?: boolean
  width: number | string
}

export const PhoneNumberCell = memo(
  ({ contact, isRowSelected = false, width }: Props) => {
    const attributes: IContactAttribute[] = useMemo(
      () => contact?.attributes || [],
      [contact?.attributes]
    )

    return (
      <AttributeCell
        countEnabled
        isSelectable
        attributes={attributes}
        isRowSelected={isRowSelected}
        width={width}
        attributeInputPlaceholder="(123) 456 - 7890"
        attributeDescription="Phone Number"
        attributeType="phone_number"
        attributeLabel="Main"
        valueFormatter={formatPhoneNumber}
      />
    )
  }
)
