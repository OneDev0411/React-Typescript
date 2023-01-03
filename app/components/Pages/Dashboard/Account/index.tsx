import { ReactElement } from 'react'

import Box from '@material-ui/core/Box'
import { connect } from 'react-redux'
import { useTitle, useLocation } from 'react-use'

import { RouteComponentProps } from '@app/routes/types'
import { withRouter } from '@app/routes/with-router'
import PageLayout from 'components/GlobalPageLayout'
import { IAppState } from 'reducers'

import SettingsTabs from './Tabs'

interface Props extends RouteComponentProps {
  user: IUser
  children: ReactElement<any>
}

const AccountLayout = ({ user, children }: Props) => {
  const location = useLocation()

  const documentTitle = () => {
    let title = ''

    switch (location.pathname) {
      case '/dashboard/account':
        title = 'Profile | Settings | Rechat'
        break
      case '/dashboard/account/manage-tags':
        title = 'Manage Tags | Settings | Rechat'
        break
      case '/dashboard/account/triggers':
        title = 'Trigger | Settings | Rechat'
        break
      case '/dashboard/account/email-signature':
        title = 'Email Signature | Settings | Rechat'
        break
      case '/dashboard/account/connected-accounts':
        title = 'Connected Accounts | Settings | Rechat'
        break
      case '/dashboard/account/email-templates':
        title = 'Email Templates | Settings | Rechat'
        break
      case '/dashboard/account/exportCalendar':
        title = 'Calendar Export | Settings | Rechat'
        break
      case '/dashboard/account/upgrade':
        title = 'Upgrade to agent | Settings | Rechat'
        break
      case '/dashboard/account/reminder-notifications':
        title = 'Reminder Notifications | Settings | Rechat'
        break
      default:
        title = 'My Settings | Rechat'
    }

    return title
  }

  useTitle(documentTitle())

  return (
    <PageLayout>
      <PageLayout.Header title="My Settings" />
      <PageLayout.Main>
        <SettingsTabs user={user} />
        <Box paddingTop={1}>{children}</Box>
      </PageLayout.Main>
    </PageLayout>
  )
}

export default withRouter(
  connect(({ user }: IAppState) => ({ user }))(AccountLayout)
)
