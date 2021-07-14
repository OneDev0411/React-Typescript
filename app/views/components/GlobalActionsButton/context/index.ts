import { createContext } from 'react'

import { initialState } from './reducers'

export interface StateContextType {
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

export type DispatchContextType = React.Dispatch<any>
export const StateContext = createContext<StateContextType>(initialState)
export const DispatchContext = createContext<DispatchContextType>(() => null)
