import { IContactAttributeType } from '../types'

export function useAttributeTypes(): Record<string, IContactAttributeType> {
  return {
    full_address: {
      name: 'full_address',
      label: 'Full Address',
      section: 'Addresses',
      show: true,
      singular: true
    }
  }
}
