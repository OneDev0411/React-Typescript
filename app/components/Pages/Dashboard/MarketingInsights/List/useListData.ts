import { useEffect } from 'react'

import getCampaings from 'models/insights/emails/get-all-campaigns'

import { ActionGeneralTypes as ActionType, InsightFiltersType } from './types'
import { doFilterOnInsightList } from './helpers'
import useStateReducer from './useStateReducer'

export default function useListData(
  user: IUser,
  queue: number,
  filterType: InsightFiltersType,
  onLoad: () => void
) {
  const [state, dispatch] = useStateReducer()

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
    } catch (error) {
      console.error(error)
      dispatch({
        type: ActionType.FETCH_FAILED,
        payload: {
          isLoading: false,
          hasError: true
        }
      })
    } finally {
      onLoad()
    }
  }

  useEffect(() => {
    fetchData()
  }, [user, queue, filterType])

  return state
}
