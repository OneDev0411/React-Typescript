import { useSelector } from 'react-redux'

import { selectUserUnsafe } from '@app/selectors/user'

export function useUnsafeUser(): ReturnType<typeof selectUserUnsafe> {
  const unsafeUser = useSelector(selectUserUnsafe)

  return unsafeUser
}
