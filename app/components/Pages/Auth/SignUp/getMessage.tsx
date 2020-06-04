import React from 'react'
import { Link } from 'react-router'

export function getFailedMessage(errorCode, email) {
  if (errorCode === 409) {
    return (
      <div className="c-auth__submit-alert c-auth__submit-alert--warning">
        An account with this email address exists in our system. Please{' '}
        <Link to={`/password/forgot?email=${encodeURIComponent(email)}`}>
          reset your password
        </Link>{' '}
        or{' '}
        <Link to={`/signin?username=${encodeURIComponent(email)}`}>
          sign in
        </Link>
        .
      </div>
    )
  }

  return (
    <div className="c-auth__submit-error-alert">
      There was an error with this request. Please try again.
    </div>
  )
}

export function getSucceedMessage(isUserShadow, email) {
  return (
    <div style={{ textAlign: 'center' }}>
      <p className="c-auth__submit-alert--success">
        We {isUserShadow ? 'resent a new' : ' sent an'} activation email.
        <br />
        Please check <b>{email}</b>
      </p>
      <div className="c-auth__subtitle">
        <Link to={`/signin?username=${encodeURIComponent(email)}`}>
          Sign in
        </Link>
      </div>
    </div>
  )
}
