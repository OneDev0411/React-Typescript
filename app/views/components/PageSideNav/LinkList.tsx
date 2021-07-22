import React from 'react'

import SideNavItem from './SideNavItem'
import SideNavSection from './SideNavSection'
import SideNavTitle from './SideNavTitle'
import { LinkListSection } from './types'

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
