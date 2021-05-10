import { useSelector } from 'react-redux'

import { upsertContactAttributes } from 'models/contacts/helpers/upsert-contact-attributes'

import { selectContactAttributeDefs } from 'selectors/contacts'

import useAsync from 'hooks/use-async'

import type { CreateContactInput } from './types'

interface UpdateContactReturn {
  updateContact: (
    contact: IContact,
    attributes: CreateContactInput
  ) => Promise<IContact>
  contact: Nullable<IContact>
  isUpdatingContact: boolean
}

function useUpdateContact(): UpdateContactReturn {
  const attributeDefs = useSelector(selectContactAttributeDefs)
  const { isLoading, run, data } = useAsync<IContact>()

  return {
    updateContact: async (
      contact: IContact,
      attributes: Partial<CreateContactInput>
    ) => {
      const upsertedAttributes: Partial<IContactAttribute>[] = []

      const attrDefIdToAttrData = (contact.attributes || []).reduce<
        Record<UUID, Partial<IContactAttribute>>
      >(
        (acc, attribute) => ({
          ...acc,
          [attribute.attribute_def.id]: {
            id: attribute.id,
            [attribute.attribute_def.data_type]:
              attribute[attribute.attribute_def.data_type]
          }
        }),
        {}
      )

      Object.keys(attributes).forEach((attribute: keyof CreateContactInput) => {
        const attributeDefId = attributeDefs.byName[attribute]

        if (attributeDefId) {
          const attributeDef = attributeDefs.byId[attributeDefId]

          if (
            !attrDefIdToAttrData[attributeDefId] ||
            attributes[attribute] !==
              attrDefIdToAttrData[attributeDefId][attributeDef.data_type]
          ) {
            upsertedAttributes.push({
              id: attrDefIdToAttrData[attributeDefId]?.id,
              attribute_def: attributeDef,
              [attributeDef.data_type]: attributes[attribute]
            })
          }
        }
      })

      if (!upsertedAttributes.length) {
        return Promise.resolve(contact)
      }

      return run(async () =>
        upsertContactAttributes(contact.id, upsertedAttributes, {
          associations: [
            'contact.attributes',
            'contact_attribute.attribute_def'
          ]
        })
      )
    },
    contact: data,
    isUpdatingContact: isLoading
  }
}

export default useUpdateContact
