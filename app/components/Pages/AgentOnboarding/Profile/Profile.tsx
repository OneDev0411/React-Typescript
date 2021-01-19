import React, { useState, useEffect } from 'react'
import { browserHistory } from 'react-router'
import { useSelector, useDispatch } from 'react-redux'
import { Box } from '@material-ui/core'
import { Alert } from '@material-ui/lab'
import { makeStyles, Theme } from '@material-ui/core'
import idx from 'idx'

import { editUser } from 'models/user/edit'
import { uploadUserProfileImage } from 'models/user/upload-avatar'

import { IAppState } from 'reducers'
import { selectAllConnectedAccounts } from 'reducers/contacts/oAuthAccounts'

import { updateUser } from 'actions/user'

import { getUserDefaultHomepage } from 'utils/get-default-home-page'

import CircleSpinner from 'components/SvgIcons/CircleSpinner/IconCircleSpinner'
import { useEditorState } from 'components/TextEditor/hooks/use-editor-state'

import { selectUserUnsafe } from 'selectors/user'

import Header from '../Header'
import SkipButton from '../SkipButton'
import NextButton from '../NextButton'
import Container from '../Container'
import { useDocumentTitle } from '../use-document-title'

import Avatar from './Avatar'
import EmailSignatureEditor from './EmailSignatureEditor'
import { getOauthAccountAvatar } from './get-oauth-account-avatar'

const useStyles = makeStyles(
  (theme: Theme) => ({
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
  useDocumentTitle('Profile')

  const classes = useStyles()
  const dispatch = useDispatch()
  const user = useSelector(selectUserUnsafe)
  const brand = useSelector((store: IAppState) => store.brand)

  const [editorState, setEditorState, signatureEditor] = useEditorState('')

  const [nextStepUrl, setNextStepUrl] = useState(getUserDefaultHomepage(user))

  const [submitError, setSubmitError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const connectedAccounts = useSelector((store: IAppState) =>
    selectAllConnectedAccounts(store.contacts.oAuthAccounts)
  )

  const hasSignature = editorState.getCurrentContent().getPlainText()

  const [avatar, setAvatar] = useState(getOauthAccountAvatar(connectedAccounts))

  useEffect(() => {
    const REDIRECT_KEY = 'onboarding_redirectAtTheEnd'
    const redirectTo = window.localStorage.getItem(REDIRECT_KEY)

    if (redirectTo) {
      setNextStepUrl(redirectTo)
    }

    return () => window.localStorage.removeItem(REDIRECT_KEY)
  }, [])

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

      if (hasSignature) {
        requestBody.email_signature = signatureEditor.getHtml()
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
        <EmailSignatureEditor
          editorState={editorState}
          onChange={setEditorState}
        />
      </Box>
      {submitError && !submitting && (
        <Box mt={3}>
          <Alert severity="error">{submitError}</Alert>
        </Box>
      )}

      {submitting && <CircleSpinner />}
      {(hasSignature || avatar.src) && !submitting && (
        <NextButton onClick={onSubmit}>Let's Go!</NextButton>
      )}
    </Container>
  )
}
