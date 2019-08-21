import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Helmet } from 'react-helmet'

import SideNav from 'components/SideNav'

import {
  Container as PageContainer,
  Content as PageContent
} from '../../../../views/components/SlideMenu'
import SavedSearchesList from './SavedSearchesList'

const urlGenerator = url => `/dashboard/mls${url && `/${url}`}`

const sideNavSections = [
  {
    title: 'Properties',
    items: [
      {
        isIndex: true,
        title: 'Search',
        link: urlGenerator('')
      },
      {
        title: 'Following',
        link: urlGenerator('following')
      }
    ]
  }
]

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
            <SideNav sections={sideNavSections}>
              <SavedSearchesList />
            </SideNav>
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
