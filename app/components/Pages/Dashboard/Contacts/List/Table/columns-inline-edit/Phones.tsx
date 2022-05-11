import { isPhoneNumber } from '@app/utils/validations'

import { InlineEditAttributeCell } from './AttributeCell'

interface Props {
  contact: IContactWithAssoc<'contact.attributes'>
}

export function PhonesInlineEdit({ contact }: Props) {
  return (
    <InlineEditAttributeCell
      attributeName="phone_number"
      addLabel="Add Another Phone Number"
      contact={contact}
      validateRules={{
        text: () => undefined,
        label: (value: string) => isPhoneNumber(value)
      }}
    />
  )
}
