import { ReactElement } from 'react'

import Box from '@material-ui/core/Box'
import { connect } from 'react-redux'
import { useTitle } from 'react-use'

import PageLayout from 'components/GlobalPageLayout'
import { IAppState } from 'reducers'

import SettingsTabs from './Tabs'

interface Props {
  user: IUser
  children: ReactElement<any>
}

const AccountLayout = ({ user, children }: Props) => {
  useTitle('My Settings | Rechat')

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

export default connect(({ user }: IAppState) => ({ user }))(AccountLayout)
