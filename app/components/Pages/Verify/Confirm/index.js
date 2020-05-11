import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import compose from 'recompose/compose'
import withState from 'recompose/withState'
import lifecycle from 'recompose/lifecycle'
import withHandlers from 'recompose/withHandlers'

import Alert from '../../Dashboard/Partials/Alert'
import { getBrandInfo } from '../../Auth/SignIn/get-brand-info'
import verify from '../../../../models/verify'
import { Spinner } from '../../../Partials/Loading'
import { updateUser } from '../../../../store_actions/user'

const ERROR_MESSAGE =
  "You have encountered an unknown system issue. We're working on it. In the meantime, connect with our support."

const confirmVerify = ({
  brand,
  verifyType,
  userMessage,
  isSubmitting,
  verifyQueryParams
}) => {
  const { siteLogo, siteTitle } = getBrandInfo(brand)

  return (
    <div className="signin-page-wrapper">
      <article className="c-auth">
        <header className="c-auth__header" style={{ marginBottom: '4rem' }}>
          {siteLogo && (
            <Link to="/" tabIndex={-1}>
              <img
                src={siteLogo}
                alt={`${siteTitle} logo`}
                className="c-auth__logo"
              />
            </Link>
          )}
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
          {isSubmitting && <Spinner />}

          {userMessage && (
            <div>
              <Alert {...userMessage} style={{ marginBottom: '1rem' }}>
                {userMessage.text}
              </Alert>
              <div style={{ textAlign: 'center' }}>
                <Link to="/dashboard/mls">go to the dashboard</Link>
              </div>
            </div>
          )}
        </main>
      </article>
    </div>
  )
}

export default compose(
  connect(
    ({ brand }, { location: { query }, params: { verifyType } }) => {
      const { email, email_code, phone_code, phone_number } = query

      const verifyQueryParams = {
        verifyType
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
        verifyQueryParams
      }
    },
    { updateUser }
  ),
  withState('userMessage', 'setUserMessage', null),
  withState('isSubmitting', 'setIsSubmitting', true),
  withHandlers({
    verifyRequestHandler: ({
      verifyType,
      setUserMessage,
      setIsSubmitting,
      verifyQueryParams
    }) => () => {
      setUserMessage(null)

      const to =
        verifyType === 'email'
          ? verifyQueryParams.body.email
          : verifyQueryParams.body.phone_number

      verify
        .request(verifyType)
        .then(() => {
          setIsSubmitting(false)
          setUserMessage({
            type: 'success',
            text: `Your previous activation code has expired. We\'ve sent a new verification link to ${to}.`
          })
        })
        .catch(errorCode => {
          setIsSubmitting(false)
          setUserMessage({
            code: errorCode,
            type: 'error',
            text: ERROR_MESSAGE
          })
        })
    }
  }),
  withHandlers({
    confirmHandler: ({
      updateUser,
      verifyType,
      verifyQueryParams,
      setUserMessage,
      setIsSubmitting,
      verifyRequestHandler
    }) => () => {
      setUserMessage(null)

      verify
        .confirm(verifyQueryParams)
        .then(user => {
          updateUser(user)
          setIsSubmitting(false)
          setUserMessage({
            type: 'success',
            text: `${
              verifyType === 'email' ? 'Email' : 'Phone number'
            } is verified.`
          })
        })
        .catch(errorCode => {
          if (errorCode === 403) {
            verifyRequestHandler()

            return
          }

          setIsSubmitting(false)
          setUserMessage({
            code: errorCode,
            type: 'error',
            text: ERROR_MESSAGE
          })
        })
    }
  }),
  lifecycle({
    componentDidMount() {
      const { confirmHandler } = this.props

      confirmHandler()
    }
  })
)(confirmVerify)
