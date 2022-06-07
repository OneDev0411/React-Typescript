import { useTheme } from '@material-ui/core'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import withState from 'recompose/withState'

import { Logo } from '@app/views/components/OAuthPageLayout/Logo'
import { PoweredBy } from '@app/views/components/OAuthPageLayout/PoweredBy'

import verify from '../../../../models/verify'

const RequestVerify = ({
  verifyType,
  submitError,
  isSubmitting,
  submitSuccessfully,
  verifyRequestHandler
}) => {
  const theme = useTheme()

  return (
    <div className="signin-page-wrapper">
      <article className="c-auth">
        <header className="c-auth__header">
          <Link to="/" tabIndex={-1}>
            <Logo />
          </Link>
          <p className="c-auth__subtitle">
            Request a {verifyType} verification link
          </p>
        </header>
        <main className="c-auth__main">
          {!submitSuccessfully ? (
            <div>
              {submitError && (
                <div className="c-auth__submit-error-alert">
                  An unexpected error occurred. Please try again.
                </div>
              )}
              <button
                type="button"
                onClick={verifyRequestHandler}
                className="c-auth__submit-btn"
                disabled={isSubmitting}
                style={{
                  background: theme.palette.primary.main,
                  opacity: isSubmitting ? 0.7 : 1
                }}
              >
                {isSubmitting ? 'Requesting...' : 'Request'}
              </button>
            </div>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <p className="c-auth__submit-alert--success">
                <span>Your request sent successfully.</span>
                <br />
                <span>You may now want </span>
                <Link to="/dashboard/mls">going to the dashboard</Link>.
              </p>
            </div>
          )}
        </main>
      </article>
      <PoweredBy />
    </div>
  )
}

export default compose(
  connect(({ brand }, { params: { verifyType } }) => ({
    brand,
    verifyType
  })),
  withState('submitError', 'setSubmitError', false),
  withState('isSubmitting', 'setIsSubmitting', false),
  withState('submitSuccessfully', 'setSubmitSuccessfully', false),
  withHandlers({
    verifyRequestHandler:
      ({
        verifyType,
        setSubmitError,
        setIsSubmitting,
        setSubmitSuccessfully
      }) =>
      () => {
        setIsSubmitting(true)

        verify
          .request(verifyType)
          .then(() => {
            setIsSubmitting(false)
            setSubmitSuccessfully(true)
          })
          .catch(() => {
            setIsSubmitting(false)
            setSubmitError(true)
          })
      }
  })
)(RequestVerify)
