import { useMemo } from 'react'

import { useSelector } from 'react-redux'

import { selectDefinitionByName } from '@app/reducers/contacts/attributeDefs'
import { selectContactAttributeDefs } from '@app/selectors/contacts'

import { formatValue } from '../../../Profile/components/ContactAttributeInlineEditableField/helpers'

interface Props {
  contact: IContact
  className: string
}

export function HomeAnniversary({ contact, className }: Props) {
  const attributeDefs = useSelector(selectContactAttributeDefs)
  const definition = selectDefinitionByName(attributeDefs, 'home_anniversary')

  const homeAnniversary = useMemo(() => {
    return contact.attributes?.find(
      attr => attr.attribute_type === definition?.name
    )?.[definition?.data_type!]
  }, [contact.attributes, definition?.data_type, definition?.name])

  return (
    <div className={className}>{formatValue(definition, homeAnniversary)}</div>
  )
}
