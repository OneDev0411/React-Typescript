import { useSelector } from 'react-redux'

import useAsync from 'hooks/use-async'

import { selectContactAttributeDefs } from 'selectors/contacts'
import { selectUserId } from 'selectors/user'

import { createContacts } from 'models/contacts/create-contacts'
import { defaultQuery } from 'models/contacts/helpers/default-query'

import { CreateContactInput } from './types'

interface CreateContactReturn {
  createContact: (attributes: CreateContactInput) => Promise<IContact>
  contact: Nullable<IContact>
  isCreatingContact: boolean
}

function useCreateContact(): CreateContactReturn {
  const attributeDefs = useSelector(selectContactAttributeDefs)
  const userId = useSelector(selectUserId)

  const { isLoading, run, data } = useAsync<IContact>()

  return {
    createContact: (attributes: Partial<CreateContactInput>) => {
      const newContact: {
        user: UUID
        attributes: Partial<IContactAttribute>[]
      } = {
        user: userId,
        attributes: []
      }

      Object.keys(attributes).forEach((attribute: keyof CreateContactInput) => {
        const attributeDefId = attributeDefs.byName[attribute]

        if (attributeDefId) {
          const attributeDef = attributeDefs.byId[attributeDefId]

          newContact.attributes.push({
            attribute_def: attributeDef,
            [attributeDef.data_type]: attributes[attribute]
          })
        }
      })

      return run(async () => {
        const contacts = await createContacts([newContact], {
          ...defaultQuery,
          // @ts-ignore
          // TODO: fix the `get` type issue
          get: true
        })

        return contacts[0]
      })
    },
    contact: data,
    isCreatingContact: isLoading
  }
}

export default useCreateContact
