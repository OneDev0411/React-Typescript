import { useState } from 'react'

import { useSelector } from 'react-redux'

import { selectUser } from '@app/selectors/user'

export function useOwner() {
  const user = useSelector(selectUser)

  return useState(user)
}
