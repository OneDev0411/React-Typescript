import { useContext } from 'react'

import WebsiteCardDataContext from './WebsiteCardContext'

function useWebsiteCardData() {
  const website = useContext(WebsiteCardDataContext)

  if (!website) {
    throw new Error(
      'The useWebsiteCardData hook must be used within WebsiteCardProvider'
    )
  }

  return website
}

export default useWebsiteCardData
