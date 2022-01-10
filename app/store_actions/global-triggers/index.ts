import { Dispatch } from 'redux'

import { getTriggers } from '@app/models/instant-marketing/global-triggers'
import {
  REQUEST_GLOBAL_TRIGGERS_FAILED,
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

const requestGlobalTriggersFailed = () =>
  ({
    type: REQUEST_GLOBAL_TRIGGERS_FAILED
  } as const)

export type RequestGlobalTriggersFailedAction = ReturnType<
  typeof requestGlobalTriggersFailed
>

const setGlobalTriggers = (triggers: IGlobalTriggerState['attrs']) =>
  ({
    type: SET_GLOBAL_TRIGGERS,
    payload: triggers
  } as const)

export type SetGlobalTriggersAction = ReturnType<typeof setGlobalTriggers>

export const setGlobalTrigger = (
  trigger: IGlobalTrigger<'template' | 'template_instance'>
) =>
  ({
    type: SET_GLOBAL_TRIGGER,
    payload: trigger
  } as const)

export type SetGlobalTriggerAction = ReturnType<typeof setGlobalTrigger>

export const fetchGlobalTriggers =
  (brandId: UUID) => async (dispatch: Dispatch) => {
    dispatch(requestGlobalTriggers())

    const triggers: IGlobalTrigger<'template' | 'template_instance'>[] =
      await getTriggers(brandId)

    if (triggers.length > 0) {
      const attributes = {} as IGlobalTriggerState['attrs']

      triggers.forEach(trigger => (attributes[trigger.event_type] = trigger))
      dispatch(setGlobalTriggers(attributes))
    } else {
      dispatch(requestGlobalTriggersFailed())
    }
  }
