import { createContext } from 'react'

const WebsiteListActionsContext = createContext<
  | {
      addItem: (instance: IWebsite) => void
      deleteItem: (websiteId: UUID) => void
      updateItem: (
        websiteId: UUID,
        update: Partial<Omit<IWebsite, 'id'>>
      ) => void
    }
  | undefined
>(undefined)

export default WebsiteListActionsContext
