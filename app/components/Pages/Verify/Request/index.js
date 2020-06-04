import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import compose from 'recompose/compose'
import withState from 'recompose/withState'
import withHandlers from 'recompose/withHandlers'

import { getBrandInfo } from '../../Auth/SignIn/get-brand-info'
import verify from '../../../../models/verify'

const requestVerify = ({
  brand,
  verifyType,
  submitError,
  isSubmitting,
  submitSuccessfully,
  verifyRequestHandler
}) => {
  const { siteLogo, siteTitle, brandColor } = getBrandInfo(brand)

  return (
    <div className="signin-page-wrapper">
      <article className="c-auth">
        <header className="c-auth__header">
          {siteLogo && (
            <Link to="/" tabIndex={-1}>
              <img
                src={siteLogo}
                alt={`${siteTitle} logo`}
                className="c-auth__logo"
              />
            </Link>
          )}
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
                  background: brandColor,
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
    verifyRequestHandler: ({
      verifyType,
      setSubmitError,
      setIsSubmitting,
      setSubmitSuccessfully
    }) => () => {
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
)(requestVerify)
