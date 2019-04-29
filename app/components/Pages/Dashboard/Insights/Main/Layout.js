import React from 'react'
import { Helmet } from 'react-helmet'

import {
  Container as PageContainer,
  Menu as SideMenu,
  Content as PageContent
} from 'components/SlideMenu'
import { ListTitle } from 'components/SlideMenu/Menu/styled'

import Menu from './Menu'

function InsightsLayout(props) {
  const items = [
    {
      title: 'Sent',
      url: '/',
      badge: props.sentBadge
    }
  ]

  return (
    <PageContainer isOpen={props.isSideMenuOpen}>
      <Helmet>
        <title>Insights | Rechat</title>
      </Helmet>

      <SideMenu isOpen={props.isSideMenuOpen}>
        <ListTitle className="onboarding--intro">Emails</ListTitle>
        <Menu items={items} />
      </SideMenu>

      <PageContent isSideMenuOpen={props.isSideMenuOpen}>
        {props.children}
      </PageContent>
    </PageContainer>
  )
}

export default InsightsLayout
