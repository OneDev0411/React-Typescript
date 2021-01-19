import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useEffectOnce } from 'react-use'

import { SIGNIN_SUCCESS } from 'constants/auth/signin'
import { getUserTeams } from 'actions/user/teams'

import Fetch from 'services/fetch'
import { selectUserUnsafe } from 'selectors/user'

export function useLoadUser() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Nullable<string>>(null)
  const [isGuest, setIsGuest] = useState(false)

  const dispatch = useDispatch()
  const user = useSelector(selectUserUnsafe)

  useEffectOnce(() => {
    if (user) {
      return
    }

    const loadUser = async () => {
      setIsLoading(true)
      setIsGuest(false)

      try {
        const {
          body: { data: user }
        } = await new Fetch().get('/api/users/profile')

        dispatch({
          user: {
            ...user,
            teams: await dispatch(getUserTeams(user))
          },
          type: SIGNIN_SUCCESS
        })
      } catch (e) {
        setError(e.response.data)
        setIsGuest(e.status === 404)
      } finally {
        setIsLoading(false)
      }
    }

    loadUser()
  })

  return {
    user,
    error,
    isLoading,
    isGuest
  }
}
