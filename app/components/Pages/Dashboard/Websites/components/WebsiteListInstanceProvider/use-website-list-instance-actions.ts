import { useContext } from 'react'

import WebsiteListInstanceActionsContext from './WebsiteListInstanceActionsContext'

function useWebsiteListInstanceActions() {
  const context = useContext(WebsiteListInstanceActionsContext)

  if (!context) {
    throw new Error(
      'The useWebsiteListInstanceActions must be used within WebsiteListInstanceProvider'
    )
  }

  return context
}

export default useWebsiteListInstanceActions
