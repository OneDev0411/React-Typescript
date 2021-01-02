import React, { ReactNode, memo } from 'react'

import type { UseAsyncReturnType } from 'hooks/use-async'

import WebsiteListInstanceActionsContext from './WebsiteListInstanceActionsContext'

interface WebsiteListInstanceProviderProps
  extends Pick<UseAsyncReturnType<IWebsiteTemplateInstance[]>, 'setData'> {
  children: ReactNode
}

function WebsiteListInstanceProvider({
  setData,
  children
}: WebsiteListInstanceProviderProps) {
  const addWebsiteInstance = (instance: IWebsiteTemplateInstance) => {
    setData(instances => [...instances, instance])
  }

  const deleteWebsiteInstance = (websiteId: UUID) => {
    setData(instances =>
      instances.filter(instance => instance.id !== websiteId)
    )
  }

  return (
    <WebsiteListInstanceActionsContext.Provider
      value={{
        addWebsiteInstance,
        deleteWebsiteInstance
      }}
    >
      {children}
    </WebsiteListInstanceActionsContext.Provider>
  )
}

export default memo(WebsiteListInstanceProvider)
