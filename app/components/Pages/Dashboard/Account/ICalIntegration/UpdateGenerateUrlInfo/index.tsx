import React, { useMemo, useState } from 'react'

import { Alert } from '@material-ui/lab'
import Cookies from 'universal-cookie'

export default function UpdateGenerateUrlInfo() {
  const cookies = useMemo(() => new Cookies(), [])
  const [alreadyClosed, setAlreadyClosed] = useState(
    () => !!cookies.get('closeICalInfo')
  )

  function closeHandler() {
    cookies.set('closeICalInfo', Object(true))
    setAlreadyClosed(true)
  }

  if (alreadyClosed) {
    return null
  }

  return (
    <Alert security="info" onClose={closeHandler}>
      Don’t forget to generate a new URL whenever you change your event type
      selection and copy and paste it into all the calendars you use.
    </Alert>
  )
}
