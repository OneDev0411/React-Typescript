import React, { ReactElement } from 'react'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import { Box } from '@material-ui/core'

import Header from 'components/GlobalHeader'
import { IAppState } from 'reducers'

interface Props {
  user: IUser
  children: ReactElement<any>
}

const AccountLayout = ({ user, children }: Props) => (
  <>
    <Helmet>
      <title>Account | Rechat</title>
    </Helmet>

    <Header title="Account Settings" />
    <Box>{children}</Box>
  </>
)

export default connect(({ user }: IAppState) => ({ user }))(AccountLayout)
