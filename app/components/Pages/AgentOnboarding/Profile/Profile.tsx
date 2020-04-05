import React, { useState } from 'react'
import { browserHistory } from 'react-router'
import { useSelector, useDispatch } from 'react-redux'
import { Box } from '@material-ui/core'
import { Alert } from '@material-ui/lab'
import { createStyles, makeStyles, Theme } from '@material-ui/core'
import idx from 'idx'

import { editUser } from 'models/user/edit'
import { uploadUserProfileImage } from 'models/user/upload-avatar'

import { IAppState } from 'reducers'
import { selectAllConnectedAccounts } from 'reducers/contacts/oAuthAccounts'

import { updateUser } from 'actions/user'

import { getUserDefaultHomepage } from 'utils/get-default-home-page'

import CircleSpinner from 'components/SvgIcons/CircleSpinner/IconCircleSpinner'

import Header from '../Header'
import SkipButton from '../SkipButton'
import NextButton from '../NextButton'
import Container from '../Container'

import Avatar from './Avatar'
import EmailSignatureEditor from './EmailSignatureEditor'
import { getOauthAccountAvatar } from './get-oauth-account-avatar'

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
  const dispatch = useDispatch()
  const user = useSelector((store: IAppState) => store.user)
  const brand = useSelector((store: IAppState) => store.brand)
  const [signature, setSignature] = useState('')
  const [submitError, setSubmitError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const nextStepUrl = getUserDefaultHomepage(user)
  const connectedAccounts = useSelector((store: IAppState) =>
    selectAllConnectedAccounts(store.contacts.oAuthAccounts)
  )

  const [avatar, setAvatar] = useState(getOauthAccountAvatar(connectedAccounts))

  const onSubmit = async () => {
    let user: IUser | null = null
    let requestBody: {
      email_signature?: string
      profile_image_url?: string
    } = {}

    try {
      setSubmitting(true)

      if (avatar.file) {
        user = await uploadUserProfileImage(avatar.file)
      } else if (avatar.src) {
        requestBody.profile_image_url = avatar.src
      }

      if (signature) {
        requestBody.email_signature = signature
      }

      if (Object.keys(requestBody).length > 0) {
        user = await editUser(requestBody)
      }

      if (user) {
        dispatch(updateUser(user))
      }

      setSubmitting(false)

      browserHistory.push(nextStepUrl)
    } catch (error) {
      const message =
        idx(error, e => e.response.body.message) ||
        'Something went wrong. Please try again.'

      setSubmitError(message)
      setSubmitting(false)
    }
  }

  return (
    <Container classes={{ box: classes.container }}>
      <SkipButton to={nextStepUrl} />
      <Header
        brand={brand}
        title="Let’s make it feel more like home!"
        subtitle="Personalize your account and make your communications more connected."
      />
      <Box marginBottom={6} width="100%">
        <Avatar data={avatar} onChange={setAvatar} />
        <EmailSignatureEditor user={user} onChange={setSignature} />
      </Box>
      {submitError && !submitting && (
        <Box mt={3}>
          <Alert severity="error">{submitError}</Alert>
        </Box>
      )}

      {submitting && <CircleSpinner />}
      {(signature || avatar.src) && !submitting && (
        <NextButton onClick={onSubmit}>Let's Go!</NextButton>
      )}
    </Container>
  )
}
