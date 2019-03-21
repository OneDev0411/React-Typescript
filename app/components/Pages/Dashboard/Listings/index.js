import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Helmet } from 'react-helmet'

import {
  Container as PageContainer,
  Menu as SideMenu,
  Content as PageContent
} from '../../../../views/components/SlideMenu'
import { ListTitle } from '../../../../views/components/SlideMenu/Menu/styled'

import { MainNav } from './MainNav'
import SavedSearchesList from './SavedSearchesList'

class Listings extends Component {
  state = {
    isSideMenuOpen: !!this.props.user
  }

  toggleSideMenu = () =>
    this.setState(state => ({
      isSideMenuOpen: !state.isSideMenuOpen
    }))

  render() {
    const { user } = this.props
    const { isSideMenuOpen } = this.state

    return (
      <React.Fragment>
        <Helmet>
          <title>Properties | Rechat</title>
        </Helmet>
        <PageContainer
          isOpen={isSideMenuOpen}
          className={`l-listings ${user ? 'l-listings--logged' : ''}`}
        >
          {user && (
            <SideMenu isOpen={isSideMenuOpen}>
              <ListTitle>Properties</ListTitle>
              <MainNav />

              <SavedSearchesList />
            </SideMenu>
          )}

          <PageContent isSideMenuOpen={isSideMenuOpen} style={{ padding: 0 }}>
            {user
              ? React.Children.map(this.props.children, child =>
                  React.cloneElement(child, {
                    isSideMenuOpen,
                    toggleSideMenu: this.toggleSideMenu
                  })
                )
              : this.props.children}
          </PageContent>
        </PageContainer>
      </React.Fragment>
    )
  }
}

export default connect(({ user }) => ({ user }))(Listings)
