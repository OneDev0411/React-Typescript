import { createContext } from 'react'

import { initialState } from './reducers'

export interface StateContext {
  onCreateEvent: (event: IEvent) => void
  onCreateContact?: (contact: IContact) => void
  onCreateAndAddNewContact?: (contact: IContact) => void
  onCreateEmail: (email: IEmailCampaign) => void
  onCreateEmailFollowUp: (email: IEvent) => void
  onCreateTour: (
    tour: ICRMTask<CRMTaskAssociation, CRMTaskAssociationType>
  ) => void
  onCreateOpenHouse: (
    oh: ICRMTask<CRMTaskAssociation, CRMTaskAssociationType>
  ) => void
}

export type DispatchContext = React.Dispatch<any>
export const StateContext = createContext<StateContext>(initialState)
export const DispatchContext = createContext<DispatchContext>(() => null)
