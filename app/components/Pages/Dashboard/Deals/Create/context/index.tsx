import React from 'react'

import type { Form } from '../types'

export interface IContextState {
  form: Partial<Form>
  deal: Nullable<IDeal>
  user: IUser
  updateForm: (data: Partial<Form>) => void
}

export const Context = React.createContext<IContextState | undefined>(undefined)
