import { Dispatch } from 'redux'

import { getTriggers } from '@app/models/instant-marketing/global-triggers'
import {
  REQUEST_GLOBAL_TRIGGERS,
  SET_GLOBAL_TRIGGERS,
  SET_GLOBAL_TRIGGER
} from 'constants/global-triggers'

import { IGlobalTriggerState } from '../../reducers/global-triggers'

const requestGlobalTriggers = () =>
  ({
    type: REQUEST_GLOBAL_TRIGGERS
  } as const)

export type RequestGlobalTriggersAction = ReturnType<
  typeof requestGlobalTriggers
>

const setGlobalTriggers = (triggers: IGlobalTriggerState['attrs']) =>
  ({
    type: SET_GLOBAL_TRIGGERS,
    payload: triggers
  } as const)

export type SetGlobalTriggersAction = ReturnType<typeof setGlobalTriggers>

export const setGlobalTrigger = (trigger: IGlobalTrigger) =>
  ({
    type: SET_GLOBAL_TRIGGER,
    payload: trigger
  } as const)

export type SetGlobalTriggerAction = ReturnType<typeof setGlobalTrigger>

export const fetchGlobalTriggers =
  (brandId: UUID) => async (dispatch: Dispatch) => {
    dispatch(requestGlobalTriggers())

    const triggers: IGlobalTrigger[] = await getTriggers(brandId)
    // @ts-ignore
    const dd: IGlobalTriggerState['attrs'] = {}

    triggers.forEach(trigger => (dd[trigger.event_type] = trigger))

    dispatch(setGlobalTriggers(dd))
  }
