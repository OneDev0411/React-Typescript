import React, { ReactNode, memo, useMemo } from 'react'

import type { UseAsyncReturnType } from 'hooks/use-async'

import WebsiteListActionsContext from './WebsiteListActionsContext'

interface WebsiteListProviderProps
  extends Pick<UseAsyncReturnType<IWebsite[]>, 'setData'> {
  children: ReactNode
}

function WebsiteListProvider({ setData, children }: WebsiteListProviderProps) {
  const contextValue = useMemo(
    () => ({
      addItem: (instance: IWebsite) => {
        setData(instances => [...instances, instance])
      },
      deleteItem: (websiteId: UUID) => {
        setData(instances =>
          instances.filter(instance => instance.id !== websiteId)
        )
      },
      updateItem: (websiteId: UUID, update: Partial<Omit<IWebsite, 'id'>>) => {
        setData(instances =>
          instances.map(instance =>
            instance.id === websiteId ? { ...instance, ...update } : instance
          )
        )
      }
    }),
    [setData]
  )

  return (
    <WebsiteListActionsContext.Provider value={contextValue}>
      {children}
    </WebsiteListActionsContext.Provider>
  )
}

export default memo(WebsiteListProvider)
