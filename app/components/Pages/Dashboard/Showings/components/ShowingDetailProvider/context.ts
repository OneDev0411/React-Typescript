import { createContext, Dispatch, SetStateAction } from 'react'

export const ShowingDetailIdContext = createContext<Optional<UUID>>(undefined)

export const ShowingDetailSetDataContext = createContext<
  Optional<Dispatch<SetStateAction<IShowing>>>
>(undefined)

export const ShowingDetailHasApprovalAccessContext = createContext<
  Optional<boolean>
>(undefined)
