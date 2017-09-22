import React from 'react'
import Tab from './Tab'

const Tabs = ({ user }) => (
  <ul className="c-tabs c-tabs--stack">
    <Tab indexed text="Profile" to="/dashboard/account" />
    <Tab text="Payment" to="/dashboard/account/payment" disabled />
    <Tab text="Upgrade" disabled={user.brand} to="/dashboard/account/upgrade" />
  </ul>
)

export default Tabs
