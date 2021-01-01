import React, { useState } from 'react'

import { useTitle } from 'react-use'

import PageSideNav from 'components/PageSideNav'
import { Container, Content } from 'components/SlideMenu'

import { Sidenav } from './Sidenav'
import { Header } from './Header'
import { SiteCardItem } from '../components/SiteCardItem'

import { ListContainer } from './styled'

export default function WebsitesPage() {
  const [isSideNavOpen, setIsSideNavOpen] = useState<boolean>(true)

  const toggleSideNav = () => setIsSideNavOpen(!isSideNavOpen)

  useTitle('Websites | Rechat')

  return (
    <Container isOpen={isSideNavOpen}>
      <PageSideNav isOpen={isSideNavOpen}>
        <Sidenav />
      </PageSideNav>
      <Content isSideMenuOpen={isSideNavOpen}>
        <Header onToggleSidenav={toggleSideNav} />

        <ListContainer>
          <SiteCardItem />
          <SiteCardItem />
          <SiteCardItem />
          <SiteCardItem />
          <SiteCardItem />
          <SiteCardItem />
          <SiteCardItem />
          <SiteCardItem />
        </ListContainer>
      </Content>
    </Container>
  )
}
