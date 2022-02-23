import { memo, useMemo } from 'react'

import { mdiEmailOutline } from '@mdi/js'

import { CellAction } from './CellContainer'
import { AttributeCell } from './types/AttributeCell'

interface Props {
  contact: IContact
  onSave?: (e: any) => void
  isRowSelected?: boolean
  width: number | string
}

export const EmailCell = memo(
  ({ contact, isRowSelected = false, width }: Props) => {
    const actions: Record<string, CellAction> = {
      email: {
        tooltipText: 'Email',
        onClick: () => console.log('email!'),
        iconPath: mdiEmailOutline
      }
    }
    const attributes: IContactAttribute[] = useMemo(
      () => contact?.attributes || [],
      [contact?.attributes]
    )

    return (
      <AttributeCell
        isSelectable
        countEnabled
        attributes={attributes}
        isRowSelected={isRowSelected}
        attributeInputPlaceholder="john@doe.com"
        attributeDescription="Email Address"
        attributeType="email"
        attributeLabel="Main"
        actions={actions}
        width={width}
      />
    )
  }
)
