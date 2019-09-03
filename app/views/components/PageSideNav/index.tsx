import React from 'react'

import { SideNavContainer } from './styled'
import { PageSideNavProps, SectionsEnum } from './types'

import LinkList from './LinkList'

PageSideNav.defaultProps = {
  isOpen: true
}

function PageSideNav(props: PageSideNavProps) {
  return (
    <SideNavContainer isOpen={props.isOpen}>
      {props.sections &&
        props.sections.map((section, secIndex) => {
          switch (section.type) {
            case SectionsEnum.LINK:
              return <LinkList section={section} key={`sec-${secIndex}`} />
            default:
              return null
          }
        })}
      {props.children}
    </SideNavContainer>
  )
}

export default PageSideNav
