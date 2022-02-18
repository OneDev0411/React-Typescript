import { createContext } from 'react'

interface IContext {
  list: IDealRoleDefinition[]
  byName: Record<string, IDealRoleDefinition>
}

export const Context = createContext<IContext>({
  list: [],
  byName: {}
})
