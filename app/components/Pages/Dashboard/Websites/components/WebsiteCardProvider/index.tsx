import React, { memo, ReactNode } from 'react'

import WebsiteCardDataContext from './WebsiteCardContext'

interface WebsiteCardProviderProps {
  website: IWebsite
  children: ReactNode
}

function WebsiteCardProvider({ website, children }: WebsiteCardProviderProps) {
  return (
    <WebsiteCardDataContext.Provider value={website}>
      {children}
    </WebsiteCardDataContext.Provider>
  )
}

export default memo(WebsiteCardProvider)
