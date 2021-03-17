import { createUpsertObject } from 'models/Deal/helpers/dynamic-context'
import { normalizeAddress } from 'models/Deal/helpers/normalize-address'

export function createAddressContext(deal: IDeal, address: unknown) {
  return Object.entries(normalizeAddress(address)).reduce<
    {
      definition: any // TODO: needs typing for contact definitions
      checklist: IDealChecklist
      value: string | number
      approved: boolean
    }[]
  >((acc, [name, value]) => {
    const context = createUpsertObject(deal, name, value, true)

    if (context) {
      acc.push(context)
    }

    return acc
  }, [])
}
