import React, { ReactNode, memo } from 'react'

import type { UseAsyncReturnType } from 'hooks/use-async'

import WebsiteListActionsContext from './WebsiteListActionsContext'

interface WebsiteListProviderProps
  extends Pick<UseAsyncReturnType<IWebsiteTemplateInstance[]>, 'setData'> {
  children: ReactNode
}

function WebsiteListProvider({ setData, children }: WebsiteListProviderProps) {
  const addItem = (instance: IWebsiteTemplateInstance) => {
    setData(instances => [...instances, instance])
  }

  const deleteItem = (websiteId: UUID) => {
    setData(instances =>
      instances.filter(instance => instance.id !== websiteId)
    )
  }

  const updateItem = (
    websiteId: UUID,
    update: Partial<Omit<IWebsiteTemplateInstance, 'id'>>
  ) => {
    setData(instances =>
      instances.map(instance =>
        instance.id === websiteId ? { ...instance, ...update } : instance
      )
    )
  }

  return (
    <WebsiteListActionsContext.Provider
      value={{
        addItem,
        deleteItem,
        updateItem
      }}
    >
      {children}
    </WebsiteListActionsContext.Provider>
  )
}

export default memo(WebsiteListProvider)
