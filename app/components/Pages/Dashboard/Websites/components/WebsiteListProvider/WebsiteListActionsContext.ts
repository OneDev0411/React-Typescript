import { createContext } from 'react'

const WebsiteListActionsContext = createContext<
  | {
      addItem: (instance: IWebsiteTemplateInstance) => void
      deleteItem: (websiteId: UUID) => void
      updateItem: (
        websiteId: UUID,
        update: Partial<Omit<IWebsiteTemplateInstance, 'id'>>
      ) => void
    }
  | undefined
>(undefined)

export default WebsiteListActionsContext
