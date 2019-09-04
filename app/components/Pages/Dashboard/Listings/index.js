import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Helmet } from 'react-helmet'

import PageSideNav from 'components/PageSideNav'
import IconSearch from 'components/SvgIcons/Search/IconSearch'
import IconNotification from 'components/SvgIcons/Notifications/IconNotifications'
import {
  Container as PageContainer,
  Content as PageContent
} from 'components/SlideMenu'

import { SectionsEnum } from 'components/PageSideNav/types'

import SavedSearchesList from './SavedSearchesList'

const urlGenerator = url => `/dashboard/mls${url}`

const sideNavSections = [
  {
    type: SectionsEnum.LINK,
    title: 'Properties',
    items: [
      {
        isIndex: true,
        title: 'Search',
        icon: IconSearch,
        link: urlGenerator('/')
      },
      {
        title: 'Following',
        icon: IconNotification,
        link: urlGenerator('/following')
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
            <PageSideNav isOpen={isSideMenuOpen} sections={sideNavSections}>
              <SavedSearchesList />
            </PageSideNav>
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
