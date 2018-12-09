import React, { Component } from 'react'
import { withRouter } from 'react-router'

import {
  Container as PageContainer,
  Menu as SideMenu,
  Content as PageContent
} from 'components/SlideMenu'
import { ListTitle } from 'components/SlideMenu/Menu/styled'

import { Menu } from './Menu'

class Marketing extends Component {
  state = {
    isSideMenuOpen: true
  }

  toggleSideMenu = () =>
    this.setState(state => ({
      isSideMenuOpen: !state.isSideMenuOpen
    }))

  render() {
    const { isSideMenuOpen } = this.state

    return (
      <PageContainer isOpen={isSideMenuOpen}>
        <SideMenu isOpen={isSideMenuOpen}>
          <ListTitle>Marketing</ListTitle>
          <Menu />
        </SideMenu>

        <PageContent
          isSideMenuOpen={isSideMenuOpen}
          style={{ background: '#f2f2f2' }}
        >
          {React.Children.map(this.props.children, child =>
            React.cloneElement(child, {
              ...this.props.params,
              isSideMenuOpen,
              toggleSideMenu: this.toggleSideMenu
            })
          )}
        </PageContent>
      </PageContainer>
    )
  }
}

export default withRouter(Marketing)
