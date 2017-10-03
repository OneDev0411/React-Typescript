import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import compose from 'recompose/compose'
import withState from 'recompose/withState'
import withHandlers from 'recompose/withHandlers'

import Brand from '../../../../controllers/Brand'
import { getBrandInfo } from '../../Auth/SignIn'
import verify from '../../../../models/verify'

const getErrorMessage = (errorCode, verifyParams, isLoggedIn) => {
  const { verifyType, body, receivingUserEmail } = verifyParams
  const redirectTo = `redirectTo=${encodeURIComponent(
    `/verify/request/${verifyType}`
  )}`
  const verifyTypeIsEmail = verifyType === 'email'
  const username = !verifyTypeIsEmail
    ? ''
    : `&username=${encodeURIComponent(body.email || receivingUserEmail)}`

  switch (errorCode) {
    case 403:
      return (
        <div>
          Sorry, this verify link is not valid anymore.
          {!isLoggedIn && (
            <p>
              Currently you aren't logged in on app, for receive new verify link
              you must login. Please
              <Link to={`/signin?${redirectTo + username}`}> sign in</Link>.
            </p>
          )}
        </div>
      )
    default:
      return ''
  }
}

const confirmVerify = ({
  brand,
  verifyType,
  verifyQueryParams,
  submitError,
  isSubmitting,
  userIsLoggedIn,
  confirmHandler,
  submitSuccessfully,
  verifyRequestHandler
}) => {
  const { siteLogo, siteTitle, brandColor } = getBrandInfo(brand)
  const hasInvalidCodeError =
    userIsLoggedIn && submitError && submitError.errorCode === 403

  const submitButtonText = () => {
    if (!hasInvalidCodeError) {
      return isSubmitting ? 'Verifying...' : 'Confirm'
    }
    return isSubmitting ? 'Submiting...' : 'Submit a new verify request'
  }

  return (
    <div className="signin-page-wrapper">
      <article className="c-auth">
        <header className="c-auth__header">
          {siteLogo && (
            <Link to="/" tabIndex={-1}>
              <img
                src={siteLogo}
                alt={`${siteTitle} logo`}
                className={'c-auth__logo'}
              />
            </Link>
          )}
          <h1 className="c-auth__title tempo">{`${siteTitle}`}</h1>
          <p className="c-auth__subticonfirmtle">Verification for</p>
          <p>
            {
              verifyQueryParams.body[
                verifyType === 'phone' ? 'phone_number' : 'email'
              ]
            }
          </p>
        </header>
        <main className="c-auth__main">
          {!submitSuccessfully ? (
            <div>
              {submitError && (
                <div className="c-auth__submit-error-alert">
                  {submitError.message}
                </div>
              )}
              {(userIsLoggedIn || submitError.errorCode !== 403) && (
                <button
                  onClick={
                    hasInvalidCodeError ? verifyRequestHandler : confirmHandler
                  }
                  className="c-auth__submit-btn"
                  disabled={isSubmitting}
                  style={{
                    background: brandColor,
                    opacity: isSubmitting ? 0.7 : 1
                  }}
                >
                  {submitButtonText()}
                </button>
              )}
            </div>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <p className="c-auth__submit-alert--success">
                <span>This account is verified.</span>
                <br />
                {userIsLoggedIn ? (
                  <Link to="/dashboard/mls">go to dashboard</Link>
                ) : (
                  <span>
                    Please{' '}
                    <Link
                      to={`/signin${verifyType === 'email'
                        ? `?username=${encodeURIComponent(
                          verifyQueryParams.body.email
                        )}`
                        : ''}`}
                    >
                      sign in
                    </Link>
                  </span>
                )}.
              </p>
            </div>
          )}
        </main>
      </article>
    </div>
  )
}

export default compose(
  connect(
    (
      { brand, user: userIsLoggedIn },
      { location: { query }, params: { verifyType } }
    ) => {
      const {
        email,
        email_code,
        phone_code,
        phone_number,
        receivingUserEmail
      } = query

      const verifyQueryParams = {
        verifyType,
        receivingUserEmail
      }

      if (verifyType === 'email') {
        verifyQueryParams.body = {
          email,
          email_code
        }
      }

      if (verifyType === 'phone') {
        verifyQueryParams.body = {
          phone_number,
          code: phone_code
        }
      }

      return {
        brand,
        verifyType,
        userIsLoggedIn,
        verifyQueryParams
      }
    }
  ),
  withState('submitError', 'setSubmitError', false),
  withState('isSubmitting', 'setIsSubmitting', false),
  withState('submitSuccessfully', 'setSubmitSuccessfully', false),
  withHandlers({
    confirmHandler: ({
      userIsLoggedIn,
      verifyType,
      verifyQueryParams,
      setSubmitError,
      setIsSubmitting,
      setSubmitSuccessfully
    }) => () => {
      setIsSubmitting(true)

      verify
        .confirm(verifyQueryParams)
        .then(statusCode => {
          setIsSubmitting(false)
          setSubmitSuccessfully(true)
        })
        .catch(errorCode => {
          setIsSubmitting(false)
          setSubmitError({
            errorCode,
            message: getErrorMessage(
              errorCode,
              verifyQueryParams,
              userIsLoggedIn
            )
          })
        })
    },
    verifyRequestHandler: ({
      verifyType,
      setSubmitError,
      setIsSubmitting,
      setSubmitSuccessfully
    }) => () => {
      setIsSubmitting(true)

      verify
        .request(verifyType)
        .then(statusCode => {
          setIsSubmitting(false)
          setSubmitSuccessfully(true)
        })
        .catch(errorCode => {
          setIsSubmitting(false)
          setSubmitError({
            errorCode,
            message: getErrorMessage(errorCode)
          })
        })
    }
  })
)(confirmVerify)
