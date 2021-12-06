import { createContext } from 'react'

interface IContext {
  roles: IDealRoleDefinition[]
}

export const Context = createContext<IContext>({
  roles: []
})
