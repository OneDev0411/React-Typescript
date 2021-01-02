import { createContext } from 'react'

const WebsiteListInstanceActionsContext = createContext<
  | {
      addWebsiteInstance: (instance: IWebsiteTemplateInstance) => void
      deleteWebsiteInstance: (websiteId: UUID) => void
    }
  | undefined
>(undefined)

export default WebsiteListInstanceActionsContext
