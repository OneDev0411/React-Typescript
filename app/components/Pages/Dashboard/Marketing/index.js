import React, { useState } from 'react'
import { withRouter } from 'react-router'
import { Helmet } from 'react-helmet'

import Acl from 'components/Acl'
import PageSideNav from 'components/PageSideNav'

import {
  Container as PageContainer,
  Content as PageContent
} from 'components/SlideMenu'

import { useSections } from './hooks/use-sections'

export function Marketing(props) {
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(true)
  const sections = useSections()

  const toggleSideMenu = () => setIsSideMenuOpen(!isSideMenuOpen)

  return (
    <Acl.Marketing fallbackUrl="/dashboard/mls">
      <PageContainer isOpen={isSideMenuOpen}>
        <Helmet>
          <title>Marketing | Rechat</title>
        </Helmet>

        <PageSideNav isOpen={isSideMenuOpen} sections={sections} />

        <PageContent isSideMenuOpen={isSideMenuOpen}>
          {React.Children.map(props.children, child =>
            React.cloneElement(child, {
              ...props.params,
              isSideMenuOpen,
              toggleSideMenu
            })
          )}
        </PageContent>
      </PageContainer>
    </Acl.Marketing>
  )
}

export default withRouter(Marketing)
