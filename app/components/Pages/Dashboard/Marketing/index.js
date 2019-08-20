import React, { Component, createRef } from 'react'
import { withRouter } from 'react-router'
import { Helmet } from 'react-helmet'

import Onboarding from 'components/Onboarding'
import Acl from 'components/Acl'

import IconButton from 'components/Button/IconButton'
import IconInfo from 'components/SvgIcons/InfoOutline/IconInfoOutline'

import {
  Container as PageContainer,
  Menu as SideMenu,
  Content as PageContent
} from 'components/SlideMenu'
import { ListTitle } from 'components/SlideMenu/Menu/styled'

import { OnboardingSteps } from './helpers/onboarding'

import { Menu } from './Menu'

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

          <SideMenu isOpen={isSideMenuOpen}>
            <ListTitle className="onboarding--intro">
              Marketing
              <IconButton isFit iconSize="large" onClick={this.handleShowIntro}>
                <IconInfo />
              </IconButton>
            </ListTitle>
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

          <Onboarding
            ref={this.onboardingRef}
            steps={OnboardingSteps}
            tourId="marketing-center"
          />
        </PageContainer>
      </Acl.Marketing>
    )
  }
}

export default withRouter(Marketing)
