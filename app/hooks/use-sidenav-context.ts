import { useContext } from 'react'

import { SideNavContext } from '../components/Pages/Dashboard/DashboardLayout'

export function useSideNavContext() {
  return useContext(SideNavContext)
}
