import React from 'react'
import { Link, browserHistory } from 'react-router'
import RedirectModal from '../RedirectModal'

const VerifyRedirectModal = ({ type, params, brandInfo }) => {
  const { brandColor } = brandInfo
  const { loggedInUser, receivingUser, redirectTo, verificationType } = params
  const verificationValue =
    verificationType === 'email address'
      ? receivingUser.email
      : receivingUser.phone_number

  return (
    <RedirectModal brandInfo={brandInfo}>
      {type === 'VERIFYING_CONFLICT' ? (
        <div>
          <h3 className="c-confirm-modal__title">Verification Conflict</h3>
          <p className="c-confirm-modal__message">
            You are currently logged in as a different user. Please log out to verify this account.
          </p>
          <div>
            <Link
              to="/dashboard/mls"
              style={{ textDecoration: 'none' }}
              className="c-confirm-modal__button c-confirm-modal__button--ghost"
            >
              Cancel
            </Link>
            <a
              href={`/signout?redirectFromSignout=${redirectTo}`}
              style={{
                marginLeft: '2rem',
                textDecoration: 'none',
                backgroundColor: brandColor
              }}
              className="c-confirm-modal__button"
            >
              Sign out
            </a>
          </div>
        </div>
      ) : (
        <div>
          <h3 className="c-confirm-modal__title">Invalid Request</h3>
          <p
            className="c-confirm-modal__message"
            style={{ marginBottom: '3rem' }}
          >
            {`This ${verificationType} was previously verified.`}
          </p>
          <Link
            to="/dashboard/mls"
            style={{
              padding: '1rem 2rem',
              textDecoration: 'none',
              backgroundColor: brandColor
            }}
            className="c-confirm-modal__button"
          >
            Go to the dashboard
          </Link>
        </div>
      )}
    </RedirectModal>
  )
}

export default VerifyRedirectModal
