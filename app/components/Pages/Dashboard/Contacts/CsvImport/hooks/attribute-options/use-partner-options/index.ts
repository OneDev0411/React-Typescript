import type { AttributeOption } from '../../../types'
import { useAttributeDefs } from '../../use-attribute-defs'

const Options = ['first_name', 'last_name', 'email', 'phone_number', 'birthday']

export function usePartnerOptions(): AttributeOption[] {
  const { list, byId, byName } = useAttributeDefs()

  if (list.length === 0) {
    return []
  }

  return Options.map(name => {
    const definition = byId[byName[name]]

    return {
      index: 0,
      type: 'attribute_def',
      attribute_def: definition.id,
      isPartner: true,
      disabled: false,
      label: `Spouse/Partner - ${definition.label}`
    }
  })
}
