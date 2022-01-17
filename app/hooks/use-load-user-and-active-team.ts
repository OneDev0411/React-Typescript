import { useState, useRef } from 'react'

import { useDispatch, useSelector } from 'react-redux'
import { useEffectOnce } from 'react-use'

import { getActiveTeam } from '@app/models/user/get-active-team'
import { IAppState } from '@app/reducers'
import { IUserState } from '@app/reducers/user'
import { setActiveTeam } from '@app/store_actions/active-team'
import { SIGNIN_SUCCESS } from 'constants/auth/signin'
import { selectActiveTeamUnsafe } from 'selectors/team'
import { selectUserUnsafe } from 'selectors/user'
import Fetch from 'services/fetch'

type UseLoadUserAndActiveTeamState = {
  user: IUserState
  activeTeam: Nullable<IUserTeam>
}

type UseLoadUserAndActiveTeamReturn = {
  user: IUser
  userff: any
  activeTeam: IUserTeam
  activeTeamff: any
  error: Nullable<string>
  isLoading: boolean
  isGuest: boolean
  state: UseLoadUserAndActiveTeamState
}

export function useLoadUserAndActiveTeam(): UseLoadUserAndActiveTeamReturn {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Nullable<string>>(null)
  const [isGuest, setIsGuest] = useState(false)
  let state = useSelector<IAppState, UseLoadUserAndActiveTeamState>(state => ({
    user: selectUserUnsafe(state),
    activeTeam: selectActiveTeamUnsafe(state)
  }))
  const user = useRef<IUserState>(state.user)
  const activeTeam = useRef<Nullable<IUserTeam>>(state.activeTeam)

  const dispatch = useDispatch()

  console.log('useLoadUserAndActiveTeam', { state })

  useEffectOnce(() => {
    const loadActiveTeam = async (user: IUser) => {
      try {
        const res = await getActiveTeam(user)

        activeTeam.current = res
        dispatch(setActiveTeam(res))
      } catch (e) {
        setError(e.response.data)
      }
    }

    const loadUser = async () => {
      if (user.current) {
        if (!activeTeam.current) {
          await loadActiveTeam(user.current)
        }

        return
      }

      try {
        setIsLoading(true)
        setIsGuest(false)

        const res = await new Fetch().get('/api/users/profile')
        const fetchedUser = res.body.data

        user.current = fetchedUser
        await loadActiveTeam(fetchedUser)
        dispatch({
          user: fetchedUser,
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
  // console.log('useLoadUserAndActiveTeam', {
  //   user,
  //   activeTeam
  // })

  return {
    error,
    isGuest,
    isLoading,
    user: user.current!,
    userff: user,
    activeTeam: activeTeam.current!,
    activeTeamff: activeTeam,
    state
  }
}
