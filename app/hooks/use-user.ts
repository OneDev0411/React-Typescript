import { useSelector } from 'react-redux'

import { selectUser } from '@app/selectors/user'

export function useUser(): ReturnType<typeof selectUser> {
  const user = useSelector(selectUser)

  return user
}
