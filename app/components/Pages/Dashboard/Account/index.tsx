import React, { ReactElement } from 'react'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import Box from '@material-ui/core/Box'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'

import Header from 'components/GlobalHeader'
import { IAppState } from 'reducers'

import SettingsTabs from './Tabs'

interface Props {
  user: IUser
  children: ReactElement<any>
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    content: {
      padding: theme.spacing(2),
      margin: theme.spacing(3, 0),
      border: `2px solid ${theme.palette.divider}`,
      borderRadius: theme.shape.borderRadius
    }
  })
)

const AccountLayout = ({ user, children }: Props) => {
  const classes = useStyles()

  return (
    <>
      <Helmet>
        <title>Account | Rechat</title>
      </Helmet>

      <Header title="Account Settings" />
      <SettingsTabs user={user} />
      <Box className={classes.content}>{children}</Box>
    </>
  )
}

export default connect(({ user }: IAppState) => ({ user }))(AccountLayout)
