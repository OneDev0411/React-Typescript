import { mdiEmailOutline } from '@mdi/js'

import { CellAction } from './CellContainer'
import AttributeCell from './types/AttributeCell'

interface Props {
  contact: IContact
  onSave?: (e: any) => void
  isRowSelected?: boolean
}

const EmailCell = ({ contact, isRowSelected = false }: Props) => {
  const actions: Record<string, CellAction> = {
    email: {
      tooltipText: 'Email',
      onClick: () => console.log('email!'),
      iconPath: mdiEmailOutline
    }
  }

  return (
    <AttributeCell
      attributes={contact.attributes || []}
      isRowSelected={isRowSelected}
      countEnabled
      attribute_type="email"
      attribute_label="Main"
      actions={actions}
    />
  )
}

export default EmailCell
