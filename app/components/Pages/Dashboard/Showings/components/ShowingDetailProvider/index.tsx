import { ReactNode } from 'react'

import { ShowingDetailIdContext, ShowingDetailSetDataContext } from './context'

interface ShowingDetailProviderProps {
  id: UUID
  setData: (showing: IShowing) => void
  children: ReactNode
}

function ShowingDetailProvider({
  id,
  setData,
  children
}: ShowingDetailProviderProps) {
  return (
    <ShowingDetailIdContext.Provider value={id}>
      <ShowingDetailSetDataContext.Provider value={setData}>
        {children}
      </ShowingDetailSetDataContext.Provider>
    </ShowingDetailIdContext.Provider>
  )
}

export default ShowingDetailProvider
export { default as useShowingDetailId } from './use-showing-detail-id'
export { default as useShowingDetailSetData } from './use-showing-detail-set-data'
