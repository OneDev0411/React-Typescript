import React from 'react'
import { connect } from 'react-redux'
import Tabs from './components/Tabs'

const AccountLayout = ({ user, children }) => (
  <div className="l-account">
    <aside className="l-account__sidebar">
      <header className="l-account__sidebar__header">
        <h1>Account Settings</h1>
      </header>
      <Tabs user={user} />
    </aside>
    <main className="l-account__main">{children}</main>
  </div>
)

export default connect(({ user }) => ({ user }))(AccountLayout)
