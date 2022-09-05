import { DateField } from '@app/components/Pages/Dashboard/Contacts/Profile/components/ContactAttributeInlineEditableField/EditMode/Value/fields'
import { Values as DateFieldType } from '@app/utils/validations/date-field'

interface Props {
  currentValue: number
  onChange: (date: DateFieldType) => void
}

export const DateOperatorComponent = ({ currentValue, onChange }: Props) => (
  <DateField onChange={onChange} value={currentValue} />
)
