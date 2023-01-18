import { useTheme } from '@material-ui/styles'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import compose from 'recompose/compose'
import withState from 'recompose/withState'
import { Field, reduxForm } from 'redux-form'
import isEmail from 'validator/lib/isEmail'

import { useSearchParams } from '@app/hooks/use-search-param'
import { withRouter } from '@app/routes/with-router'
import { Logo } from '@app/views/components/OAuthPageLayout/Logo'
import { PoweredBy } from '@app/views/components/OAuthPageLayout/PoweredBy'

import resetPassword from '../../../../../models/auth/password/reset'
import signup from '../../../../../models/auth/signup'
import Button from '../../../../../views/components/Button/ActionButton'
import SimpleField from '../../../Dashboard/Account/Profile/components/SimpleField'

const ForgotForm = ({
  submitError,
  isSubmitting,
  setSubmitError,
  resetSuccessfully,
  setIsSubmitting,
  setResetSuccessfully
}) => {
  const isDisabled = isSubmitting
  const theme = useTheme()
  const [searchParams] = useSearchParams()

  const username = searchParams.get('email')

  const onSubmitHandler = async event => {
    event.preventDefault()

    const email = event.target.email.value

    setIsSubmitting(true)

    try {
      const response = await resetPassword(email)

      if (response.status === 204) {
        setIsSubmitting(false)
        setResetSuccessfully(email)
      }
    } catch ({ status, response }) {
      if (status === 403) {
        try {
          await signup(email)
        } catch (error) {}

        setIsSubmitting(false)
        setResetSuccessfully(email)

        return
      }

      let errorMessage = 'Password recovery email expired.'

      if (status === 404) {
        errorMessage = (
          <div>
            Sorry, that email address is not registered with us.
            <br />
            <span>Please try again or</span>
            <Link to="/signup"> register for a new account</Link>.
          </div>
        )
      }

      setIsSubmitting(false)
      setSubmitError(errorMessage)
    }
  }

  return (
    <div className="signin-page-wrapper">
      <article className="c-auth">
        <header className="c-auth__header">
          <a href="/" tabIndex={-1}>
            <Logo />
          </a>

          {!resetSuccessfully && (
            <p className="c-auth__subtitle">Forgot your password?</p>
          )}
        </header>
        <main className="c-auth__main">
          {!resetSuccessfully ? (
            <form onSubmit={onSubmitHandler}>
              <Field
                autoFocus
                name="email"
                type="email"
                label="Email"
                onChange={(e, value, newValue) => {
                  if (submitError && newValue) {
                    setSubmitError(false)
                  }
                }}
                component={SimpleField}
              />
              {submitError && (
                <div className="c-auth__submit-error-alert">{submitError}</div>
              )}
              <Button
                type="submit"
                isBlock
                disabled={isDisabled}
                style={{ marginBottom: '2em' }}
                brandColor={theme.palette.primary.main}
              >
                {isSubmitting ? 'Submitting...' : 'Reset Password'}
              </Button>
              <p className="c-auth__subtitle">
                <small>Change your mind?</small>&nbsp;&nbsp;
                <Link to={`/signin?username=${encodeURIComponent(username)}`}>
                  Sign in
                </Link>
              </p>
            </form>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <p className="c-auth__submit-alert--success">
                Your reset link was delivered.
                <br />
                Please check <b>{resetSuccessfully}</b>.
              </p>
              <a className="c-auth__subtitle" href="/">
                Back to homepage
              </a>
            </div>
          )}
        </main>
      </article>
      <PoweredBy />
    </div>
  )
}

export const validateEmail = values => {
  const errors = {}

  if (!values.email) {
    errors.email = 'Required'
  } else if (!isEmail(values.email)) {
    errors.email = 'Invalid email address'
  }

  return errors
}

export default withRouter(
  compose(
    connect(({ brand }, { searchParams }) => {
      const initialValues = {
        email: searchParams.get('email') || ''
      }

      return {
        brand,
        initialValues
      }
    }),
    reduxForm({
      form: 'forgot',
      validate: validateEmail
    }),
    withState('submitError', 'setSubmitError', false),
    withState('isSubmitting', 'setIsSubmitting', false),
    withState('resetSuccessfully', 'setResetSuccessfully', false)
  )(ForgotForm)
)
