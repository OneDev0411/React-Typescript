import React, { Component } from 'react'
import { connect } from 'react-redux'

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
    isSideMenuOpen: true
  }

  componentDidMount() {
    // for overwrite css styles (google suggestion)
    document.body.setAttribute('data-page', 'mls')
  }

  toggleSideMenu = () =>
    this.setState(state => ({
      isSideMenuOpen: !state.isSideMenuOpen
    }))

  render() {
    const { user } = this.props
    const { isSideMenuOpen } = this.state

    return (
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

        <PageContent style={{ padding: 0 }}>
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
    )
  }
}

export default connect(({ user }) => ({ user }))(Listings)
