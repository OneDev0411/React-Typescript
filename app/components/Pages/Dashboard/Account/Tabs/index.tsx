// @ts-nocheck
import { ACL } from 'constants/acl'

import React from 'react'
import { Link } from 'react-router'

import Acl from 'components/Acl'
import { PageTabs, Tab } from 'components/PageTabs'

interface Props {
  user: IUser
}

const CrmAccess = props => (
  <Acl.Crm>
    <Link {...props} />
  </Acl.Crm>
)

const Items: Array<object> = [
  {
    label: 'Profile',
    to: '/dashboard/account'
  },
  {
    label: 'Upgrade to agent',
    to: '/dashboard/account/upgrade'
  },
  {
    label: 'Manage Tags',
    to: '/dashboard/account/manage-tags',
    component: CrmAccess
  },
  {
    label: 'Email Signature',
    to: '/dashboard/account/email-signature'
  },
  {
    label: 'Connected Accounts',
    to: '/dashboard/account/connected-accounts'
  },
  {
    label: 'Flows',
    to: '/dashboard/account/flows',
    component: CrmAccess
  },
  {
    label: 'Email Templates',
    to: '/dashboard/account/email-templates'
  },
  {
    label: 'Reminder Notifications',
    to: '/dashboard/account/reminder-notifications',
    component: props => (
      <Acl access={{ oneOf: [ACL.CRM, ACL.DEALS] }}>
        <Link {...props} />
      </Acl>
    )
  },
  {
    label: 'Calendar Export',
    to: '/dashboard/account/exportCalendar',
    component: CrmAccess
  }
]

export const SettingsTabs = ({ user }: Props) => {
  const currentUrl = window.location.pathname

  return (
    <PageTabs
      defaultValue={currentUrl}
      tabs={Items.map(({ label, to, component = false }, i) => {
        const Component = component || Link

        return (
          <Tab key={i} component={Component} label={label} to={to} value={to} />
        )
      })}
    />
  )
}

export default SettingsTabs
