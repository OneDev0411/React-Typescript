import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { Helmet } from 'react-helmet'

import {
  Container as PageContainer,
  Menu as SideMenu,
  Content as PageContent
} from 'components/SlideMenu'
import { ListTitle } from 'components/SlideMenu/Menu/styled'

import Menu from './Menu'

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
        <Helmet>
          <title>Insights | Rechat</title>
        </Helmet>

        <SideMenu isOpen={isSideMenuOpen}>
          <ListTitle className="onboarding--intro">Emails</ListTitle>
          <Menu />
        </SideMenu>

        <PageContent isSideMenuOpen={isSideMenuOpen}>
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
