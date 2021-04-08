import { useContext } from 'react'

import WebsiteListActionsContext from './WebsiteListActionsContext'

function useWebsiteListActions() {
  const context = useContext(WebsiteListActionsContext)

  if (!context) {
    throw new Error(
      'The useWebsiteListActions must be used within WebsiteListProvider'
    )
  }

  return context
}

export default useWebsiteListActions
