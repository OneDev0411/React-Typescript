import React, { ReactElement } from 'react'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import Box from '@material-ui/core/Box'

import PageLayout from 'components/GlobalPageLayout'
import { IAppState } from 'reducers'

import SettingsTabs from './Tabs'

interface Props {
  user: IUser
  children: ReactElement<any>
}

const AccountLayout = ({ user, children }: Props) => {
  return (
    <>
      <Helmet>
        <title>Account | Rechat</title>
      </Helmet>
      <PageLayout>
        <PageLayout.Header title="Account Settings" />
        <PageLayout.Main>
          <SettingsTabs user={user} />
          <Box paddingTop={1}>{children}</Box>
        </PageLayout.Main>
      </PageLayout>
    </>
  )
}

export default connect(({ user }: IAppState) => ({ user }))(AccountLayout)
