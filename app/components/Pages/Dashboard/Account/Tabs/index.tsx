import React from 'react'
import { withRouter, WithRouterProps } from 'react-router'

import { hasUserAccessToCrm, hasUserAccessToDeals } from 'utils/user-teams'
import { PageTabs, TabLink } from 'components/PageTabs'

interface ItemsShape {
  label: string
  to: string
  isHidden?: (user: IUser) => boolean
  component?: React.ReactNode
}

const hasNotAccessToCRM = user => !hasUserAccessToCrm(user)

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
    isHidden: hasNotAccessToCRM
  },
  {
    label: 'Email Signature',
    to: '/dashboard/account/email-signature',
    isHidden: hasNotAccessToCRM
  },
  {
    label: 'Connected Accounts',
    to: '/dashboard/account/connected-accounts',
    isHidden: hasNotAccessToCRM
  },
  {
    label: 'Email Templates',
    to: '/dashboard/account/email-templates',
    isHidden: hasNotAccessToCRM
  },
  {
    label: 'Reminder Notifications',
    to: '/dashboard/account/reminder-notifications',
    isHidden: user => !hasUserAccessToDeals(user) || hasNotAccessToCRM(user)
  },
  {
    label: 'Calendar Export',
    to: '/dashboard/account/exportCalendar',
    isHidden: hasNotAccessToCRM
  }
]

interface Props {
  user: IUser
}

export const SettingsTabs = ({ user, location }: Props & WithRouterProps) => {
  const currentUrl = location.pathname
  const matchingTabs = tabs.filter(({ to }) => currentUrl.startsWith(to))
  const matchingTab = matchingTabs.sort((a, b) => b.to.length - a.to.length)[0]

  return (
    <PageTabs
      defaultValue={matchingTab.to}
      tabs={tabs
        .filter(({ isHidden }) => !isHidden || !isHidden(user))
        .map(({ label, to }, i) => (
          <TabLink key={i} label={label} to={to} value={to} />
        ))}
    />
  )
}

export default withRouter(SettingsTabs)
