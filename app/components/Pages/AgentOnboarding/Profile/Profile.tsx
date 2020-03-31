import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Box } from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core'

import { IAppState } from 'reducers'

import { getUserDefaultHomepage } from 'utils/get-default-home-page'

import Header from '../Header'
import SkipButton from '../SkipButton'
import NextButton from '../NextButton'
import Container from '../Container'

import Avatar from './Avatar'
import EmailSignatureEditor from './EmailSignatureEditor'

const useStyles = makeStyles(
  (theme: Theme) =>
    createStyles({
      container: {
        maxWidth: '784px'
      },
      marginBottom: {
        marginBottom: theme.spacing(2)
      },
      buttonText: {
        marginLeft: theme.spacing(2)
      }
    }),
  { name: 'OAuthAccounts' }
)

export function Profile() {
  const classes = useStyles()
  const user = useSelector((store: IAppState) => store.user)
  const brand = useSelector((store: IAppState) => store.brand)
  const [signature, setSignature] = useState('')
  const [avatar, setAvatar] = useState(user.profile_image_url)
  const nextStepUrl = getUserDefaultHomepage(user)

  console.log(signature)

  return (
    <Container classes={{ box: classes.container }}>
      <SkipButton to={nextStepUrl} />
      <Header
        brand={brand}
        title="Nearly there, let’s make it feel more like home"
        subtitle="Personalize your account and make your communications more connected."
      />
      <Box marginBottom={6} width="100%">
        <Avatar src={avatar} onChange={setAvatar} />
        <EmailSignatureEditor user={user} onChange={setSignature} />
      </Box>
      <NextButton to={nextStepUrl} text="Let's Go!" />
    </Container>
  )
}
