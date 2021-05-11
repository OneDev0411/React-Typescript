import { Dispatch } from 'redux'

import {
  DECREASE_SHOWING_TOTAL_NOTIFICATIONS_COUNT,
  INCREASE_SHOWING_TOTAL_NOTIFICATIONS_COUNT,
  SET_SHOWING_TOTAL_NOTIFICATIONS_COUNT
} from 'constants/showings'
import getShowingTotalNotificationCount from 'models/showing/get-showing-total-notification-count'

const setShowingTotalNotificationCount = (count: number) =>
  ({
    type: SET_SHOWING_TOTAL_NOTIFICATIONS_COUNT,
    payload: count
  } as const)

export type SetShowingTotalNotificationCountAction = ReturnType<
  typeof setShowingTotalNotificationCount
>

export const decreaseShowingTotalNotificationCount = (count: number = 1) =>
  ({
    type: DECREASE_SHOWING_TOTAL_NOTIFICATIONS_COUNT,
    payload: count
  } as const)

export type DecreaseShowingTotalNotificationCountAction = ReturnType<
  typeof decreaseShowingTotalNotificationCount
>

export const increaseShowingTotalNotificationCount = (count: number = 1) =>
  ({
    type: INCREASE_SHOWING_TOTAL_NOTIFICATIONS_COUNT,
    payload: count
  } as const)

export type IncreaseShowingTotalNotificationCountAction = ReturnType<
  typeof increaseShowingTotalNotificationCount
>

export const fetchShowingTotalNotificationCount = () => async (
  dispatch: Dispatch
) => {
  dispatch(
    setShowingTotalNotificationCount(await getShowingTotalNotificationCount())
  )
}
