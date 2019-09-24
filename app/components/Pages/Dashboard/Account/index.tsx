import React, { ReactElement } from 'react'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'

import PageSideNav from 'components/PageSideNav'
import SideNavSection from 'components/PageSideNav/SideNavSection'
import SideNavTitle from 'components/PageSideNav/SideNavTitle'
import { IAppState } from 'reducers'

import { ProfileTabs } from './components/Tabs'

interface Props {
  user: IUser
  children: ReactElement<any>
}

const AccountLayout = ({ user, children }: Props) => (
  <React.Fragment>
    <Helmet>
      <title>Account | Rechat</title>
    </Helmet>
    <div className="l-account">
      <PageSideNav width="15rem">
        <SideNavSection>
          <SideNavTitle>Account Settings</SideNavTitle>
          <ProfileTabs user={user} />
        </SideNavSection>
      </PageSideNav>
      <main className="l-account__main">{children}</main>
    </div>
  </React.Fragment>
)

export default connect(({ user }: IAppState) => ({ user }))(AccountLayout)
