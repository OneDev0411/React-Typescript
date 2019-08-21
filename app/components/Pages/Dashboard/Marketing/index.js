import React, { Component, createRef } from 'react'
import { withRouter } from 'react-router'
import { Helmet } from 'react-helmet'

import Acl from 'components/Acl'
import PageSideNav from 'components/PageSideNav'

import {
  Container as PageContainer,
  Content as PageContent
} from 'components/SlideMenu'

import MyDesignsIcon from './components/IconMyDesigns/IconMyDesigns'

const urlGenerator = url => `/dashboard/marketing/${url}`

const sections = [
  {
    title: 'Marketing',
    items: [
      {
        title: 'My Designs',
        link: urlGenerator('history'),
        icon: MyDesignsIcon
      }
    ]
  },
  {
    title: 'Celebrations',
    items: [
      {
        title: 'Birthday',
        link: urlGenerator('Birthday')
      },
      {
        title: 'Brand Campaigns',
        link: urlGenerator('Brand')
      },
      {
        title: 'Holiday',
        link: urlGenerator(
          'Christmas,NewYear,Valentines,StPatrick,Easter,OtherHoliday'
        )
      },
      {
        title: 'New Agent',
        link: urlGenerator('NewAgent')
      }
    ]
  },
  {
    title: 'Listings',
    items: [
      {
        title: 'As Seen In',
        link: urlGenerator('AsSeenIn')
      },
      {
        title: 'Coming Soon',
        link: urlGenerator('Coming Soon')
      },
      {
        title: 'Just Listed',
        link: urlGenerator('JustListed')
      },
      {
        title: 'Under Contract',
        link: urlGenerator('UnderContract')
      },
      {
        title: 'Just Sold',
        link: urlGenerator('JustSold')
      },
      {
        title: 'Multi Listings',
        link: urlGenerator('Listings')
      },
      {
        title: 'New Price',
        link: urlGenerator('PriceImprovement')
      },
      {
        title: 'Open House',
        link: urlGenerator('OpenHouse')
      }
    ]
  }
]

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

          <PageSideNav sections={sections} />

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
