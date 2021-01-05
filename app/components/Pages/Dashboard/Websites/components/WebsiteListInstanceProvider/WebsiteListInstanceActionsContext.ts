import { createContext } from 'react'

const WebsiteListInstanceActionsContext = createContext<
  | {
      addWebsiteInstance: (instance: IWebsiteTemplateInstance) => void
      deleteWebsiteInstance: (websiteId: UUID) => void
      updateWebsiteInstance: (
        websiteId: UUID,
        update: Partial<Omit<IWebsiteTemplateInstance, 'id'>>
      ) => void
    }
  | undefined
>(undefined)

export default WebsiteListInstanceActionsContext
