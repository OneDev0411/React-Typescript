import { useAttributeDefs } from '../../../hooks/use-attribute-defs'
import type { AttributeOption } from '../../../types'

const Options = ['first_name', 'last_name', 'email', 'phone_number', 'birthday']

export function usePartnerOptions(): AttributeOption[] {
  const { byId, byName } = useAttributeDefs()

  return Options.map(name => {
    const definition = byId[byName[name]]

    return {
      type: 'attribute_def',
      attributeDefId: definition.id,
      isPartner: true,
      disabled: false,
      label: `Spouse/Partner - ${definition.label}`
    }
  })
}
