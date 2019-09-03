import React from 'react'

import { LinkListSection } from './types'
import SideNavItem from './SideNavItem'
import SideNavTitle from './SideNavTitle'
import SideNavSection from './SideNavSection'

interface LinkListProps {
  section: LinkListSection
}

function LinkList(props: LinkListProps) {
  const { section } = props

  return (
    <SideNavSection>
      <SideNavTitle>{section.title}</SideNavTitle>
      {section.items.map((item, index) => (
        <SideNavItem {...item} key={`sec-menu-${index}`} />
      ))}
    </SideNavSection>
  )
}

export default LinkList
