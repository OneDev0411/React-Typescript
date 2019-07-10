import { useEffect, useState } from 'react'
import { formatter, get_contact_data, defaultOutput } from './helpers'

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
  contact_id: string
  data: ProfileType
}

// Hook

function useProfile(type, initData): FormatterOutputType {
  let data = formatter(type, initData)
  const [output, setOutput] = useState(data)

  useEffect(function useProfileEffect() {
    if (data.contact_id) {
      // Loading mode.
      setOutput({
        ...data,
        contact_status: 'loading'
      })

      // Getting contact from server and updating the state.
      get_contact_data(data.contact_id).then(res => setOutput(res))
    }
    return function cleanUpProfile() {}
  }, [])

  return output
}

export default useProfile
