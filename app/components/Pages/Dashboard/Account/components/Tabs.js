// import { ACL } from 'constants/acl'

import React from 'react'

// import Acl from 'components/Acl'

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
    {/* TODO: Unhide CSS (Centralized Showing Service) from users */}
    {/* Note that there are some imports commented at top which needs to be uncommented too */}
    {/* <Acl access={{ oneOf: [ACL.CRM, ACL.DEALS] }}>
      <Tab
        indexed
        text="Centralized Showing Service"
        to="/dashboard/account/css"
      />
    </Acl> */}
  </ul>
)
