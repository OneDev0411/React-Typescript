import { ReactNode } from 'react'

import { withRouter, WithRouterProps } from 'react-router'

import { useUnsafeActiveTeam } from '@app/hooks/team/use-unsafe-active-team'
import { PageTabs, TabLink } from 'components/PageTabs'
import { hasUserAccessToCrm, hasUserAccessToDeals } from 'utils/acl'

type IsHiddenType = { team: Nullable<IUserTeam>; user?: IUser }
interface ItemsShape {
  label: string
  to: string
  isHidden?: (param: IsHiddenType) => boolean
  component?: ReactNode
}

const hasNotAccessToCRM = ({ team }: IsHiddenType) => !hasUserAccessToCrm(team)

const tabs: ItemsShape[] = [
  {
    label: 'Profile',
    to: '/dashboard/account'
  },
  {
    label: 'Upgrade to agent',
    to: '/dashboard/account/upgrade',
    isHidden: ({ user }) => user?.user_type === 'Agent'
  },
  {
    label: 'Manage Tags',
    to: '/dashboard/account/manage-tags',
    isHidden: hasNotAccessToCRM
  },
  {
    label: 'Triggers',
    to: '/dashboard/account/triggers',
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
    isHidden: ({ team }: IsHiddenType) =>
      !hasUserAccessToDeals(team) || hasNotAccessToCRM({ team })
  },
  {
    label: 'Calendar Export',
    to: '/dashboard/account/exportCalendar',
    isHidden: hasNotAccessToCRM
  },
  {
    label: 'Campaigns',
    to: '/dashboard/account/campaigns'
  }
]

interface Props {
  user: IUser
}

export const SettingsTabs = ({ user, location }: Props & WithRouterProps) => {
  const activeTeam = useUnsafeActiveTeam()
  const currentUrl = location.pathname
  const matchingTabs = tabs.filter(({ to }) => currentUrl.startsWith(to))
  const matchingTab = matchingTabs.sort((a, b) => b.to.length - a.to.length)[0]

  return (
    <PageTabs
      defaultValue={matchingTab.to}
      tabs={tabs
        .filter(
          ({ isHidden }) => !isHidden || !isHidden({ team: activeTeam, user })
        )
        .map(({ label, to }, i) => (
          <TabLink key={i} label={label} to={to} value={to} />
        ))}
    />
  )
}

export default withRouter(SettingsTabs)
