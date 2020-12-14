import React from 'react'

import { ACL } from 'constants/acl'

import Acl from 'components/Acl'
import SideNavItem from 'components/PageSideNav/SideNavItem'

interface Props {
  user: IUser
}

export const ProfileTabs = ({ user }: Props) => (
  <>
    <SideNavItem link="/dashboard/account" title="Profile" isIndex />
    <SideNavItem title="Payment" />
    <SideNavItem
      link={
        user.user_type !== 'Agent' ? '/dashboard/account/upgrade' : undefined
      }
      title="Upgrade to agent"
    />

    <Acl.Crm>
      <SideNavItem link="/dashboard/account/manage-tags" title="Manage Tags" />
    </Acl.Crm>
    <SideNavItem
      link="/dashboard/account/email-signature"
      title="Email Signature"
    />
    <SideNavItem
      link="/dashboard/account/connected-accounts"
      title="Connected Accounts"
    />
    <Acl.Crm>
      <SideNavItem link="/dashboard/account/flows" title="Flows" />
    </Acl.Crm>
    <SideNavItem
      link="/dashboard/account/email-templates"
      title="Email Templates"
    />

    <Acl access={{ oneOf: [ACL.CRM, ACL.DEALS] }}>
      <SideNavItem
        link="/dashboard/account/reminder-notifications"
        title="Reminder Notifications"
      />
    </Acl>
    <Acl.Crm>
      <SideNavItem
        link="/dashboard/account/exportCalendar"
        title="Calendar Export"
      />
    </Acl.Crm>
    {/* TODO: Unhide CSS (Centralized Showing Service) from users */}
    {/* Note that there are some imports commented at top which needs to be uncommented too */}
    {/* <Acl access={{ oneOf: [ACL.CRM, ACL.DEALS] }}>
      <Tab
        indexed
        text="Centralized Showing Service"
        to="/dashboard/account/css"
      />
    </Acl> */}
  </>
)
