import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useEffectOnce } from 'react-use'
import pluralize from 'pluralize'
import { Button } from '@material-ui/core'

import { getAttributeDefs } from 'models/contacts/get-attribute-defs'
import { createContacts } from 'models/contacts/create-contacts'

import { addNotification as notify } from 'components/notification'

const SOURCE_TYPE_ATTRIBUTE_DEF_NAME = 'source_type'
const TAG_ATTRIBUTE_DEF_NAME = 'tag'

const ATTR_DEF_NAME_TO_AGENT_PROP_MAP: StringMap<keyof IAgent> = {
  first_name: 'first_name',
  last_name: 'last_name',
  email: 'email',
  phone_number: 'phone_number'
}

const NEEDED_ATTR_DEF_NAMES = Object.keys(ATTR_DEF_NAME_TO_AGENT_PROP_MAP)

interface Props {
  user: IUser
  agents: IAgent[]
}

export default function AddToContacts({ user, agents }: Props) {
  const dispatch = useDispatch()
  const [attributeDefsMap, setAttributeDefsMap] = useState<
    Nullable<StringMap<IContactAttributeDef>>
  >(null)

  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffectOnce(() => {
    async function fetchAttributeDefsMap() {
      const fetchedAttributeDefs = await getAttributeDefs()
      const newAttributeDefsMap: StringMap<IContactAttributeDef> = {}

      fetchedAttributeDefs.forEach(item => {
        if (
          item.name &&
          [
            ...NEEDED_ATTR_DEF_NAMES,
            SOURCE_TYPE_ATTRIBUTE_DEF_NAME,
            TAG_ATTRIBUTE_DEF_NAME
          ].includes(item.name)
        ) {
          newAttributeDefsMap[item.name] = item
        }
      })

      setAttributeDefsMap(newAttributeDefsMap)
    }

    fetchAttributeDefsMap()
  })

  function getContactsFromAgents(agentsList: IAgent[]) {
    if (!attributeDefsMap) {
      return []
    }

    return agentsList.map(agent => {
      return {
        user: user.id,
        attributes: [
          {
            attribute_def: attributeDefsMap[SOURCE_TYPE_ATTRIBUTE_DEF_NAME].id,
            text: 'AgentNetwork'
          },
          {
            attribute_def: attributeDefsMap[TAG_ATTRIBUTE_DEF_NAME].id,
            text: 'Agent Network'
          },
          ...NEEDED_ATTR_DEF_NAMES.map(attrDefName => ({
            attribute_def: attributeDefsMap[attrDefName].id,
            text: agent[ATTR_DEF_NAME_TO_AGENT_PROP_MAP[attrDefName]] ?? ''
          }))
        ]
      }
    })
  }

  async function handleClick() {
    try {
      setIsLoading(true)

      const contacts = getContactsFromAgents(agents)
      const response = await createContacts(contacts)

      dispatch(
        notify({
          status: 'success',
          message: `${response.info.count} new ${pluralize(
            'contacts',
            response.info.count
          )} added.`
        })
      )
    } catch (error) {
      console.error('Error creating contacts', error)
      dispatch(
        notify({
          status: 'error',
          message: 'Something went wrong. Please try again or contact support.'
        })
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant="outlined"
      disabled={!attributeDefsMap || isLoading}
      onClick={handleClick}
    >
      Add To Contacts
    </Button>
  )
}
