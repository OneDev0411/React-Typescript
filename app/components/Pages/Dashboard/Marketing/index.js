import React, { Component } from 'react'

import {
  Container as PageContainer,
  Menu as SideMenu,
  Content as PageContent
} from 'components/SlideMenu'
import { ListTitle } from 'components/SlideMenu/Menu/styled'

export default class Marketing extends Component {
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
        </SideMenu>

        <PageContent style={{ padding: '0 1.5rem' }}>
          {React.Children.map(this.props.children, child =>
            React.cloneElement(child, {
              isSideMenuOpen,
              toggleSideMenu: this.toggleSideMenu
            })
          )}
        </PageContent>
      </PageContainer>
    )
  }
}
