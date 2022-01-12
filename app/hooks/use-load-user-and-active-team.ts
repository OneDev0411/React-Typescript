import { useState } from 'react'

import { useDispatch, useSelector } from 'react-redux'
import { useEffectOnce } from 'react-use'

import { getActiveTeam } from '@app/models/user/get-active-team'
import { IUserState } from '@app/reducers/user'
import { setActiveTeam } from '@app/store_actions/active-team'
import { SIGNIN_SUCCESS } from 'constants/auth/signin'
import { selectActiveTeamUnsafe } from 'selectors/team'
import { selectUserUnsafe } from 'selectors/user'
import Fetch from 'services/fetch'

type UseLoadUserAndActiveTeamReturn = {
  user: IUserState
  error: Nullable<string>
  isLoading: boolean
  isGuest: boolean
}

export function useLoadUserAndActiveTeam(): UseLoadUserAndActiveTeamReturn {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Nullable<string>>(null)
  const [isGuest, setIsGuest] = useState(false)

  const dispatch = useDispatch()
  const activeTeam = useSelector(selectActiveTeamUnsafe)
  const user = useSelector(selectUserUnsafe)

  useEffectOnce(() => {
    const loadActiveTeam = async (user: IUser) => {
      try {
        const activeTeam = await getActiveTeam(user)

        dispatch(setActiveTeam(activeTeam))
      } catch (e) {
        setError(e.response.data)
      }
    }

    const loadUser = async () => {
      if (user) {
        if (!activeTeam) {
          await loadActiveTeam(user)
        }

        return
      }

      try {
        setIsLoading(true)
        setIsGuest(false)

        const {
          body: { data: user }
        } = await new Fetch().get('/api/users/profile')

        await loadActiveTeam(user)
        dispatch({
          user,
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
    isGuest,
    isLoading
  }
}
