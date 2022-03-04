import { IContactAttributeType } from '../../types'

export function useAttributeTypes(): Record<string, IContactAttributeType> {
  return {
    full_address: {
      name: 'full_address',
      label: 'Full Address',
      section: 'Addresses',
      show: true,
      singular: false,
      labels: ['Home', 'Work', 'Investment Property', 'Other']
    },
    tag: {
      name: 'tag',
      label: 'Comma-separated Tags',
      multivalued: true,
      show: true,
      singular: true,
      labels: []
    }
  }
}
