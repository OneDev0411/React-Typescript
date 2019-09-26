import React, { useState } from 'react'
<<<<<<< HEAD
import { Helmet } from 'react-helmet'
=======
>>>>>>> #3374 feat(website): finalize ui of websites manager

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
<<<<<<< HEAD
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
=======
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
>>>>>>> #3374 feat(website): finalize ui of websites manager
  )
}
