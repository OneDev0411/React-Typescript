import { useState } from 'react'

import { useDispatch, useSelector, shallowEqual } from 'react-redux'
import { useEffectOnce } from 'react-use'

import { getActiveTeam } from '@app/models/user/get-active-team'
import { IAppState } from '@app/reducers'
import { IUserState } from '@app/reducers/user'
import {
  setActiveTeam,
  setUserAndActiveTeam
} from '@app/store_actions/active-team'
import { getImpersonateUser } from '@app/store_actions/user/impersonate-user'
import { selectActiveTeamUnsafe } from 'selectors/team'
import { selectUserUnsafe } from 'selectors/user'
import Fetch from 'services/fetch'

type UseLoadUserAndActiveTeamState = {
  user: IUserState
  activeTeam: Nullable<IUserTeam>
}

interface UseLoadUserAndActiveTeam {
  user: IUserState
  activeTeam: Nullable<IUserTeam>
  error: Nullable<string>
  isLoading: boolean
  isGuest: boolean
}

export function useLoadUserAndActiveTeam(): UseLoadUserAndActiveTeam {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Nullable<string>>(null)
  const [isGuest, setIsGuest] = useState(false)
  const { user, activeTeam } = useSelector<
    IAppState,
    UseLoadUserAndActiveTeamState
  >(
    state => ({
      user: selectUserUnsafe(state),
      activeTeam: selectActiveTeamUnsafe(state)
    }),
    shallowEqual
  )
  const dispatch = useDispatch()

  useEffectOnce(() => {
    const loadActiveTeam = async (user: IUser) => {
      try {
        const team = await getActiveTeam(user)

        if (team !== null) {
          dispatch(setActiveTeam(team))
        }
      } catch (error) {
        console.error(error)
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
        const team = await getActiveTeam(user)

        dispatch(setUserAndActiveTeam(user, team))
      } catch (e) {
        setError(e.response.data)
        setIsGuest(e.status === 404)
      } finally {
        setIsLoading(false)
      }
    }

    loadUser()
    dispatch(getImpersonateUser())
  })

  return {
    activeTeam,
    isLoading,
    isGuest,
    error,
    user
  }
}
