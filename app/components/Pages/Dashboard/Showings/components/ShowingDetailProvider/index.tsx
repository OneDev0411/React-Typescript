import { ReactNode } from 'react'

import {
  ShowingDetailHasApprovalAccessContext,
  ShowingDetailIdContext,
  ShowingDetailSetDataContext
} from './context'

interface ShowingDetailProviderProps {
  id: UUID
  setData: (showing: IShowing) => void
  hasApprovalAccess: boolean
  children: ReactNode
}

function ShowingDetailProvider({
  id,
  setData,
  hasApprovalAccess,
  children
}: ShowingDetailProviderProps) {
  return (
    <ShowingDetailIdContext.Provider value={id}>
      <ShowingDetailSetDataContext.Provider value={setData}>
        <ShowingDetailHasApprovalAccessContext.Provider
          value={hasApprovalAccess}
        >
          {children}
        </ShowingDetailHasApprovalAccessContext.Provider>
      </ShowingDetailSetDataContext.Provider>
    </ShowingDetailIdContext.Provider>
  )
}

export default ShowingDetailProvider
export { default as useShowingDetailId } from './use-showing-detail-id'
export { default as useShowingDetailSetData } from './use-showing-detail-set-data'
