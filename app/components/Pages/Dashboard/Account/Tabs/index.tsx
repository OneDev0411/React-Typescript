import { ACL } from 'constants/acl'

import React from 'react'

import Acl from 'components/Acl'
import { PageTabs, TabLink } from 'components/PageTabs'

interface Props {
  user: IUser
}
interface ItemsShape {
  label: string
  to: string
  isHidden?: (user: IUser) => boolean
  component?: React.ReactNode
}

const CrmAccess = ({ children }) => <Acl.Crm>{children}</Acl.Crm>

const tabs: ItemsShape[] = [
  {
    label: 'Profile',
    to: '/dashboard/account'
  },
  {
    label: 'Upgrade to agent',
    to: '/dashboard/account/upgrade',
    isHidden: user => user.user_type === 'Agent'
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
    component: ({ children }) => (
      <Acl access={{ oneOf: [ACL.CRM, ACL.DEALS] }}>{children}</Acl>
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
  const matchingTabs = tabs.filter(({ to }) => currentUrl.startsWith(to))
  const matchingTab = matchingTabs.sort((a, b) => b.to.length - a.to.length)[0]

  return (
    <PageTabs
      defaultValue={matchingTab.to}
      tabs={tabs
        .filter(({ isHidden }) => !isHidden || !isHidden(user))
        .map(({ label, to, component = false }, i) => {
          const hasComponent = component ? { component } : {}

          return (
            <TabLink
              key={i}
              {...hasComponent}
              label={label}
              to={to}
              value={to}
            />
          )
        })}
    />
  )
}

export default SettingsTabs
