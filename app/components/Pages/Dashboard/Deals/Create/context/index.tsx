import React from 'react'

export interface IContextState {
  deal?: Nullable<IDeal>
  checklist?: Nullable<IDealChecklist>
  propertyTypes?: IDealPropertyType[]
  user: IUser
}

export const Context = React.createContext<IContextState | undefined>(undefined)
