import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { Helmet } from 'react-helmet'

import Onboarding from 'components/Onboarding'

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
    isSideMenuOpen: true,
    isShowingIntro: false
  }

  toggleSideMenu = () =>
    this.setState(state => ({
      isSideMenuOpen: !state.isSideMenuOpen
    }))

  handleShowIntro = () =>
    this.setState({
      isShowingIntro: true
    })

  handleFinishIntro = () =>
    this.setState({
      isShowingIntro: false
    })

  render() {
    const { isSideMenuOpen } = this.state

    return (
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

        <Onboarding
          display={this.state.isShowingIntro}
          steps={OnboardingSteps}
          cookie="marketing-center-onboarding"
          onFinishIntro={this.handleFinishIntro}
        />
      </PageContainer>
    )
  }
}

export default withRouter(Marketing)
