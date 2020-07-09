import React from 'react'

import { SideNavContainer } from './styled'
import { PageSideNavProps, SectionsEnum } from './types'

import LinkList from './LinkList'

PageSideNav.defaultProps = {
  isOpen: true,
  width: '11rem'
}

function PageSideNav(props: PageSideNavProps) {
  return (
    <SideNavContainer isOpen={props.isOpen} width={props.width}>
      {(props.sections || []).map((section, secIndex) => {
        switch (section.type) {
          case SectionsEnum.Link:
            return <LinkList section={section} key={secIndex} />
          default:
            return null
        }
      })}
      {props.children}
    </SideNavContainer>
  )
}

export default PageSideNav
