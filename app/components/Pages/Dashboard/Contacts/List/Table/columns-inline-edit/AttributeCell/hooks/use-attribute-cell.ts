import { useState, useCallback } from 'react'

import { useSelector } from 'react-redux'
import { useEffectOnce } from 'react-use'

import useNotify from '@app/hooks/use-notify'
import { addAttributes } from '@app/models/contacts/add-attributes'
import { deleteAttribute } from '@app/models/contacts/delete-attribute'
import { updateAttribute } from '@app/models/contacts/update-attribute'
import { IAppState } from '@app/reducers'

export interface UseAttributeCell {
  list: IContactAttribute[]
  attributeDef: Nullable<IContactAttributeDef>
  isAppending: boolean
  create: (data: Record<string, unknown>) => void
  update: (attributeId: UUID, data: Record<string, unknown>) => void
  remove: (attributeId: UUID) => void
  appendNewValue: () => void
  prependNewValue: () => void
}

/**
 * Returns specific contact attribute
 * @param contact The Contact
 * @param attributeName The attribute name we want to filter
 * @returns The attributes with ability create, update, delete
 */

export function useAttributeCell(
  contact: IContact,
  attributeName: string,
  callback?: () => void
): UseAttributeCell {
  const notify = useNotify()
  const attributeDef = useSelector<IAppState, Nullable<IContactAttributeDef>>(
    state => {
      const attributeDefs = state.contacts.attributeDefs
      const attributeDefId = attributeDefs.byName[attributeName]

      return attributeDefs.byId[attributeDefId] ?? null
    }
  )
  const [list, setList] = useState<IContactAttribute[]>([])
  const [isAppending, setIsAppending] = useState<boolean>(false)

  useEffectOnce(() => {
    const handleFilterAttribute = () => {
      const filteredAttributes = contact.attributes!.filter(
        attr => attr.attribute_def.id === attributeDef?.id
      )

      setList(filteredAttributes)
    }

    if ((contact.attributes ?? []).length > 0) {
      handleFilterAttribute()
    }
  })

  const appendNewValue = () => setIsAppending(true)
  const prependNewValue = useCallback(() => setIsAppending(false), [])

  const create = useCallback(
    async (data: Record<string, unknown>) => {
      try {
        const response = await addAttributes(contact.id, [
          { ...data, attribute_def: attributeDef?.id }
        ])
        const newAttrAdded = response.data[0]

        callback?.()

        setList(prevList => {
          return [...prevList, newAttrAdded]
        })
        notify({
          status: 'success',
          message: 'New attribute added!'
        })
      } finally {
        prependNewValue()
      }
    },
    [attributeDef?.id, callback, contact.id, notify, prependNewValue]
  )
  const update = useCallback(
    async (attributeId: UUID, data: Record<string, unknown>) => {
      try {
        const attribute = await updateAttribute(contact.id, attributeId, data)

        callback?.()
        setList(prevList => {
          return prevList.map(attr => {
            if (attr.id === attributeId) {
              return {
                ...attr,
                ...attribute
              }
            }

            return attr
          })
        })

        notify({
          status: 'success',
          message: 'Updated!'
        })
      } catch (error) {
        notify({
          status: 'error',
          message: 'Something went wrong!'
        })
      }
    },
    [callback, contact.id, notify]
  )
  const remove = useCallback(
    async (attributeId: UUID) => {
      try {
        await deleteAttribute(contact.id, attributeId)
        callback?.()

        setList(prevList => {
          return prevList.filter(attr => attr.id !== attributeId)
        })
        notify({
          status: 'success',
          message: 'Deleted!'
        })
      } catch (error) {
        notify({
          status: 'error',
          message: 'Something went wrong!'
        })
      }
    },
    [callback, contact.id, notify]
  )

  return {
    isAppending,
    attributeDef,
    list,
    prependNewValue,
    appendNewValue,
    create,
    update,
    remove
  }
}
