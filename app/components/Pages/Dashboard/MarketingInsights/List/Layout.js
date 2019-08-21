import React from 'react'
import { Helmet } from 'react-helmet'

import {
  Container as PageContainer,
  Content as PageContent
} from 'components/SlideMenu'
import PageSideNav from 'components/PageSideNav'

const urlGenerator = url => `/dashboard/insights${url}`

function InsightsLayout(props) {
  const { isSideMenuOpen } = props
  const sections = [
    {
      title: 'Email Insight',
      items: [
        {
          title: 'Sent',
          isIndex: true,
          link: urlGenerator('/'),
          badge: props.sentCount
        },
        {
          title: 'Scheduled',
          link: urlGenerator('/scheduled'),
          badge: props.scheduledCount
        }
      ]
    }
  ]

  return (
    <PageContainer isOpen={isSideMenuOpen}>
      <Helmet>
        <title>Insights | Rechat</title>
      </Helmet>
      <PageSideNav isOpen={isSideMenuOpen} sections={sections} />
      <PageContent isSideMenuOpen={isSideMenuOpen}>
        {props.children}
      </PageContent>
    </PageContainer>
  )
}

export default InsightsLayout
