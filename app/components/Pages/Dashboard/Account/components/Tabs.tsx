// import { ACL } from 'constants/acl'

import { ACL } from 'constants/acl'

import React from 'react'

import Acl from 'components/Acl'

import Tab from './Tab'

interface Props {
  user: IUser
}

export const ProfileTabs = ({ user }: Props) => (
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
      text="Calendar Export"
      to="/dashboard/account/exportCalendar"
    />
    <Acl.Crm>
      <Tab indexed text="Manage Tags" to="/dashboard/account/manage-tags" />
    </Acl.Crm>
    <Acl.Crm>
      <Tab text="Flows" to="/dashboard/account/flows" />
    </Acl.Crm>
    <Acl access={[ACL.CRM, ACL.DEALS]}>
      <Tab
        indexed
        text="Reminder Notifications"
        to="/dashboard/account/reminder-notifications"
      />
    </Acl>
    <Tab text="Email Signature" to="/dashboard/account/email-signature" />
    <Tab text="Connected Accounts" to="/dashboard/account/connected-accounts" />
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
