import { InlineEditAttributeCell } from './AttributeCell'

interface Props {
  contact: IContactWithAssoc<'contact.attributes'>
}

export function PhonesInlineEdit({ contact }: Props) {
  return (
    <InlineEditAttributeCell
      attributeName="phone"
      addLabel="Add Another Phone Number"
      contact={contact}
    />
  )
}
