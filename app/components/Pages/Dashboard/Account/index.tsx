import React, { ReactElement } from 'react'
import { Helmet } from 'react-helmet'

import { connect } from 'react-redux'

import { IAppState } from 'reducers/index'

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
      <aside className="l-account__sidenav">
        <header className="l-account__sidenav__header">
          <h1>Account Settings</h1>
        </header>
        <ProfileTabs user={user} />
      </aside>
      <main className="l-account__main">{children}</main>
    </div>
  </React.Fragment>
)

export default connect(({ user }: IAppState) => ({ user }))(AccountLayout)
