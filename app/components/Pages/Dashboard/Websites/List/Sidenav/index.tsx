import React from 'react'

import SideNavSection from 'components/PageSideNav/SideNavSection'
import SideNavTitle from 'components/PageSideNav/SideNavTitle'
import SideNavItem from 'components/PageSideNav/SideNavItem'

export function Sidenav() {
  return (
    <SideNavSection>
      <SideNavTitle>Websites</SideNavTitle>

      <SideNavItem title="My Websites" isSelected isIndex />
      <SideNavItem title="Agent IDX Sites" isSelected />
      <SideNavItem title="Property Sites" isSelected />
    </SideNavSection>
  )
}
