import React from 'react'

import { hasUserAccessToDeals, hasUserAccessToCrm } from 'utils/user-teams'

import Tab from './Tab'

export const ProfileTabs = ({ user }) => (
  <ul className="c-tabs c-tabs--stack">
    <Tab indexed text="Profile" to="/dashboard/account" />
    <Tab text="Payment" to="/dashboard/account/payment" disabled />
    <Tab
      text="Upgrade to agent"
      to="/dashboard/account/upgrade"
      disabled={user.user_type === 'Agent'}
    />
    <Tab
      indexed
      text="Form Templates"
      to="/dashboard/account/deal/templates"
      disabled
    />
    <Tab
      indexed
      text="Calendar Export"
      to="/dashboard/account/exportCalendar"
    />
    {hasUserAccessToCrm(user) && (
      <Tab indexed text="Manage Tags" to="/dashboard/account/manage-tags" />
    )}
    {(hasUserAccessToCrm(user) || hasUserAccessToDeals(user)) && (
      <Tab
        indexed
        text="Reminder Notifications"
        to="/dashboard/account/reminder-notifications"
      />
    )}
  </ul>
)
