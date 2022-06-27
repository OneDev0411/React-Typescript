import React from 'react'

import { Box, Theme, makeStyles, Typography, Tooltip } from '@material-ui/core'
import { Alert } from '@material-ui/lab'
import { FORM_ERROR } from 'final-form'
import { Form } from 'react-final-form'
import { useDispatch } from 'react-redux'
import { browserHistory, WithRouterProps, Link } from 'react-router'
import useEffectOnce from 'react-use/lib/useEffectOnce'

import updatePassword from '../../../../models/auth/password/update'
import { editUser } from '../../../../models/user/edit'
import submitSigninForm from '../../../../store_actions/auth/signin'
import { updateUser } from '../../../../store_actions/user'
import NextButton from '../../../../views/components/OAuthFormNextButton'
import OAuthPageLayout from '../../../../views/components/OAuthPageLayout'
import CircleSpinner from '../../../../views/components/SvgIcons/CircleSpinner/IconCircleSpinner'

import { TextField } from './TextField'
import { FormValues } from './types'
import { UserTypeField } from './UserTypeField'
import { validate } from './validate'

const useStyles = makeStyles(
  (theme: Theme) => ({
    header: {
      marginBottom: theme.spacing(3)
    },
    link: {
      ...theme.typography.button,
      color: theme.palette.secondary.main,
      marginLeft: theme.spacing(0.5),
      '&:hover': {
        color: theme.palette.secondary.dark
      }
    }
  }),
  { name: 'RegisterForm' }
)

export function Register(props: WithRouterProps) {
  const classes = useStyles()
  const dispatch = useDispatch()

  const paramsFromURI: {
    first_name?: string
    last_name?: string
    phone_number?: string
    email?: string
    redirectTo?: string
    token: string
  } = props.location.query

  useEffectOnce(() => {
    if (!props.location.query.token) {
      browserHistory.push('/oops')
    }
  })

  const onSubmit = async (values: FormValues) => {
    const { first_name, last_name, email, password, user_type } = values

    let { token, redirectTo, phone_number, email: emailFromURI } = paramsFromURI

    const userPassword: {
      email?: string
      password: string
      shadow_token: string
      phone_number?: string
    } = {
      password,
      shadow_token: token
    }

    const userInfo: {
      email?: string
      last_name: string
      first_name: string
      is_shadow: boolean
    } = {
      last_name,
      first_name,
      is_shadow: false
    }

    const loginInfo = {
      password,
      user_type,
      username: emailFromURI
    }

    if (phone_number) {
      userInfo.email = email
      userPassword.phone_number = phone_number
    } else if (emailFromURI) {
      userPassword.email = emailFromURI
    }

    try {
      await updatePassword(userPassword)

      if (user_type === 'Agent') {
        if (redirectTo) {
          window.localStorage.setItem('onboarding_redirectAtTheEnd', redirectTo)
        }

        browserHistory.push({
          ...props.location,
          query: {
            ...props.location.query,
            redirectTo: '/onboarding/confirm-agent-id'
          }
        })
      }

      await dispatch(submitSigninForm(loginInfo))

      const user = await editUser(userInfo)

      dispatch(updateUser(user))
    } catch (error) {
      return {
        [FORM_ERROR]: 'Something went wrong. Please try again.'
      }
    }
  }

  const getSignInUrl = () => {
    const { email: username = '', redirectTo = '' } = paramsFromURI
    const queryString = new URLSearchParams({ username, redirectTo }).toString()

    return `/signin?${queryString}`
  }

  const getInitialValues = () => {
    const values: FormValues = {
      first_name: paramsFromURI.first_name || '',
      last_name: paramsFromURI.last_name || '',
      password: '',
      repeatedPassword: '',
      user_type: 'Agent'
    }

    if (!paramsFromURI.phone_number) {
      values.email = paramsFromURI.email || ''
    }

    return values
  }

  return (
    <OAuthPageLayout>
      <OAuthPageLayout.Header subtitle="Complete your registration" />
      <OAuthPageLayout.Main>
        <Form
          initialValues={getInitialValues()}
          onSubmit={onSubmit}
          validate={validate}
          render={({ handleSubmit, form }) => {
            const { submitError, submitting } = form.getState()

            return (
              <form onSubmit={handleSubmit}>
                {paramsFromURI.email && !paramsFromURI.phone_number && (
                  <Tooltip
                    title="You have to sign up with this email you were invited with,
                          but once you are in the app, you can always go to your settings and
                          change your email to whatever you desire."
                  >
                    <TextField
                      name="email"
                      type="email"
                      label="Email Address"
                      InputProps={{
                        readOnly: true
                      }}
                    />
                  </Tooltip>
                )}

                <TextField name="first_name" label="First Name" />

                <TextField name="last_name" label="Last Name" />

                {paramsFromURI.phone_number && (
                  <TextField name="email" type="email" label="Email Address" />
                )}

                <TextField
                  name="password"
                  type="password"
                  label="Password"
                  autoComplete="new-password"
                />

                <TextField
                  name="repeatedPassword"
                  type="password"
                  label="Repeat Password"
                  autoComplete="repeated-password"
                />

                <UserTypeField />

                {submitError && !submitting && (
                  <Box py={3}>
                    <Alert severity="error">{submitError}</Alert>
                  </Box>
                )}

                {submitting ? (
                  <div>
                    <CircleSpinner />
                  </div>
                ) : (
                  <NextButton type="submit" disabled={submitting} />
                )}
              </form>
            )
          }}
        />

        <Box pt={4} pb={6} position="relative">
          <Typography color="textSecondary" variant="button">
            Already a member,
          </Typography>
          <Link className={classes.link} to={getSignInUrl()}>
            Sign in
          </Link>
          <OAuthPageLayout.PoweredBy />
        </Box>
      </OAuthPageLayout.Main>
    </OAuthPageLayout>
  )
}
