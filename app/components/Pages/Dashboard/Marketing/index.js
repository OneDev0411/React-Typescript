import React, { Component, createRef } from 'react'
import { withRouter } from 'react-router'
import { Helmet } from 'react-helmet'

import Acl from 'components/Acl'
import PageSideNav from 'components/PageSideNav'

import {
  Container as PageContainer,
  Content as PageContent
} from 'components/SlideMenu'

import { SECTIONS } from './helpers/sections'

class Marketing extends Component {
  state = {
    isSideMenuOpen: true
  }

  onboardingRef = createRef()

  toggleSideMenu = () =>
    this.setState(state => ({
      isSideMenuOpen: !state.isSideMenuOpen
    }))

  handleShowIntro = () => {
    this.onboardingRef.current.show()
  }

  render() {
    const { isSideMenuOpen } = this.state

    return (
      <Acl.Marketing fallbackUrl="/dashboard/mls">
        <PageContainer isOpen={isSideMenuOpen}>
          <Helmet>
            <title>Marketing | Rechat</title>
          </Helmet>

          <PageSideNav sections={SECTIONS} />

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
      </Acl.Marketing>
    )
  }
}

export default withRouter(Marketing)
