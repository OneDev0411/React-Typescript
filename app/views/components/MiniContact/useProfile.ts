import { useEffect, useState } from 'react'

import { FormatterOutputType } from './types'
import { findContact, getContactData } from './helpers'
import { formatter } from './MiniContact-formatters'

// TODO: attributeDefs can be removed whenever we upgraded redux
function useProfile(type, initData, attributeDefs): FormatterOutputType {
  const data = formatter(type, initData)
  const [output, setOutput] = useState(data)

  useEffect(function profileEffectCb() {
    let requestCanceled = false

    async function fetchContact(searchFor, type: 'get' | 'find') {
      let res

      if (type === 'find') {
        res = await findContact(searchFor, data)
      } else {
        res = await getContactData(searchFor, attributeDefs)
      }

      if (!requestCanceled) {
        setOutput(res)
      }
    }

    // If it has a contact id, we should get the contact from server.
    if (data.contact_id) {
      // Loading mode.
      setOutput({
        ...data,
        contact_status: 'loading'
      })

      // Getting contact from server and updating the state.
      fetchContact(data.contact_id, 'get')
    } else if (data.data.email) {
      // If it's not a contact, we are trying to find it in contacts.

      // Loading mode.
      setOutput({
        ...data,
        contact_status: 'loading'
      })

      // Trying to find the contact, if it's not exsits, we are returning the `data`
      // if it is, we will return the contact.
      fetchContact(data.data.email, 'find')
    }

    return function cleanUpProfile() {
      requestCanceled = true
    }
    // eslint-disable-next-line
  }, [])

  return output
}

export default useProfile
