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
    console.log('addWebsiteInstance', instance)
  }

  type A = Parameters<typeof setData>

  const deleteWebsiteInstance = (websiteId: UUID) => {
    // setData([] as IWebsiteTemplateInstance[])
    setData(instances =>
      instances.filter(instance => instance.id !== websiteId)
    )
    // console.log('deleteWebsiteInstance', websiteId)
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
