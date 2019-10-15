import React, { useState } from 'react'
import { Helmet } from 'react-helmet'

import PageSideNav from 'components/PageSideNav'
import { Container, Content } from 'components/SlideMenu'

import { Sidenav } from './Sidenav'
import { Header } from './Header'
import { SiteCardItem } from '../components/SiteCardItem'

import { ListContainer } from './styled'

export default function WebsitesPage() {
  const [isSideNavOpen, setIsSideNavOpen] = useState<boolean>(true)

  const toggleSideNav = () => setIsSideNavOpen(!isSideNavOpen)

  return (
    <>
      <Helmet>
        <title>Websites | Rechat</title>
      </Helmet>

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
    </>
  )
}
