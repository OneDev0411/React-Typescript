import { useSelector } from 'react-redux'

import { selectDefinitionByName } from '@app/reducers/contacts/attributeDefs'
import useAsync from 'hooks/use-async'
import { createContacts } from 'models/contacts/create-contacts'
import { defaultQuery } from 'models/contacts/helpers/default-query'
import { selectContactAttributeDefs } from 'selectors/contacts'
import { selectUserId } from 'selectors/user'

import { CreateContactInput } from './types'

interface CreateContactReturn {
  createContact: (attributes: CreateContactInput) => Promise<IContact>
  contact: Nullable<IContact>
  isCreatingContact: boolean
}

interface CreateAttribute extends Omit<IContactAttribute, 'attribute_def'> {
  attribute_def: UUID
}

function useCreateContact(): CreateContactReturn {
  const attributeDefs = useSelector(selectContactAttributeDefs)
  const userId = useSelector(selectUserId)

  const sourceTypeDef = selectDefinitionByName(attributeDefs, 'source_type')

  const { isLoading, run, data } = useAsync<IContact>()

  return {
    createContact: (attributes: Partial<CreateContactInput>) => {
      const newContact: {
        user: UUID
        attributes: Partial<CreateAttribute>[]
      } = {
        user: userId,
        attributes: []
      }

      if (sourceTypeDef) {
        newContact.attributes.push({
          text: 'ExplicitlyCreated',
          attribute_def: sourceTypeDef.id
        })
      }

      Object.keys(attributes).forEach((attribute: keyof CreateContactInput) => {
        const attributeDefId = attributeDefs.byName[attribute]

        if (attributeDefId) {
          const attributeDef = attributeDefs.byId[attributeDefId]

          newContact.attributes.push({
            attribute_def: attributeDef.id,
            [attributeDef.data_type]: attributes[attribute]
          })
        }
      })

      return run(async () => {
        const response = await createContacts([newContact], {
          ...defaultQuery,
          // @ts-ignore
          // TODO: fix the `get` type issue
          get: true
        })

        return response.data[0]
      })
    },
    contact: data,
    isCreatingContact: isLoading
  }
}

export default useCreateContact
