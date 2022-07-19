import { useState, ReactNode } from 'react'

import { Button, Typography, Box } from '@material-ui/core'
import { Form, Field } from 'react-final-form'
import { Link } from 'react-router'

import { Logo } from '@app/views/components/OAuthPageLayout/Logo'
import { PoweredBy } from '@app/views/components/OAuthPageLayout/PoweredBy'

import signup from '../../../../models/auth/signup'
import SimpleField from '../../Dashboard/Account/Profile/components/SimpleField'
import { validateEmail } from '../Password/Forgot'

import { getFailedMessage, getSucceedMessage } from './getMessage'

interface SubmitState {
  message: ReactNode
  status: 'initial' | 'pending' | 'succeed' | 'failed'
}

export default function Signup(props) {
  const [email, setEmail] = useState<string>(
    window.decodeURIComponent(props.location.query.email || '')
  )
  const [submitState, setSubmitState] = useState<SubmitState>({
    status: 'initial',
    message: null
  })
  const isSubmitting = submitState.status === 'pending'
  const wasSuccessfulSubmit = submitState.status === 'succeed'
  const isDisabled = isSubmitting
  const onSubmitHandler = async ({ email }) => {
    setEmail(email)
    setSubmitState({
      message: null,
      status: 'pending'
    })

    try {
      const statusCode = await signup(email)

      setSubmitState({
        message: getSucceedMessage(statusCode === 202, email),
        status: 'succeed'
      })
    } catch (errorCode) {
      setSubmitState({
        message: getFailedMessage(errorCode, email),
        status: 'failed'
      })
    }
  }

  return (
    <div className="signin-page-wrapper">
      <article className="c-auth">
        <header className="c-auth__header">
          <a href="/" tabIndex={-1}>
            <Logo />
          </a>
          <h1 className="c-auth__title">Sign Up</h1>
          {!wasSuccessfulSubmit ? (
            <Typography variant="body2">Hello, lets get started.</Typography>
          ) : (
            <Typography variant="body2">Check Your Inbox.</Typography>
          )}
        </header>
        <main className="c-auth__main">
          {wasSuccessfulSubmit ? (
            submitState.message
          ) : (
            <Form
              initialValues={{ email }}
              onSubmit={onSubmitHandler}
              validate={validateEmail}
              render={({ handleSubmit }) => (
                <form onSubmit={handleSubmit}>
                  <Field
                    autoFocus
                    name="email"
                    type="email"
                    label="Email"
                    component={SimpleField}
                  />
                  {submitState.message}
                  <Box mb={4}>
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      disabled={isDisabled}
                      color="primary"
                    >
                      {isSubmitting ? 'Submitting...' : 'Sign up'}
                    </Button>
                  </Box>
                  <Box textAlign="center">
                    <Typography variant="body2">
                      <small>Already have an account?</small>&nbsp;&nbsp;
                      <Link to="/signin">Sign in</Link>
                    </Typography>
                  </Box>
                </form>
              )}
            />
          )}
        </main>
      </article>
      <PoweredBy />
    </div>
  )
}
