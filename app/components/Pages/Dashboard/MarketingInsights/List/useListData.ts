import { useEffect, useReducer } from 'react'

import reducer, { initialState } from './stateReducer'
import { ActionGeneralTypes as ActionType, InsightFiltersType } from './types'
import { doFilterOnInsightList } from './helpers'

import getCampaings from '../../../../../models/insights/emails/get-all-campaigns'

const useListData = (
  user: IUser,
  queue: number,
  filterType: InsightFiltersType
) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    async function fetchData() {
      dispatch({
        type: ActionType.FETCH_REQUEST,
        payload: {
          isLoading: true,
          activeFilter: filterType
        }
      })

      try {
        const res = await getCampaings(user)
        const data = doFilterOnInsightList(res, filterType)

        dispatch({
          type: ActionType.FETCH_SUCCESS,
          payload: {
            isLoading: false,
            ...data
          }
        })
      } catch (err) {
        dispatch({
          type: ActionType.FETCH_FAILED,
          payload: {
            isLoading: false,
            hasError: true
          }
        })
        console.log(err)
      }
    }
    fetchData()
  }, [user, queue, filterType])

  return state
}

export default useListData
