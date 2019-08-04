import { useEffect, useState } from 'react'

import { formatter, get_contact_data, find_contact } from './helpers'

// Types
export type ProfileDateType = {
  title: string
  date: number
}

export interface ProfileType {
  name?: string
  email?: string
  phone?: string
  address?: string
  profile_image_url?: string
  last_touch?: number
  dates?: ProfileDateType[]
}

type StatusType = 'loading' | 'failed' | 'finished' | 'not_started'

export interface FormatterOutputType {
  contact_status: StatusType
  contact_id: UUID
  data: ProfileType
  meta: {
    association?: any
  }
}

// Hook

function useProfile(type, initData): FormatterOutputType {
  let data = formatter(type, initData)
  const [output, setOutput] = useState(data)

  useEffect(function useProfileEffect() {
    // If it has a contact id, we should get the contact from server.
    if (data.contact_id) {
      // Loading mode.
      setOutput({
        ...data,
        contact_status: 'loading'
      })

      // Getting contact from server and updating the state.
      get_contact_data(data.contact_id).then(res => setOutput(res))
    } else if (data.data.email) {
      // If it's not a contact, we are trying to find it in contacts.

      // Loading mode.
      setOutput({
        ...data,
        contact_status: 'loading'
      })

      // Trying to find the contact, if it's not exsits, we are returning the `data`
      // if it is, we will return the contact.
      find_contact(data.data.email, data).then(res => setOutput(res))
    }

    return function cleanUpProfile() {}
    // eslint-disable-next-line
  }, [])

  return output
}

export default useProfile
