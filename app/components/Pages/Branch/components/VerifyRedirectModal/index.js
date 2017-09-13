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
          <h3 className="c-confirm-modal__title">Verify Conflict</h3>
          <p className="c-confirm-modal__message">
            Currently you are logged in with different user with this email
            <span style={{ color: '#555' }}> {loggedInUser.email}</span>.
            <br />
            {`for verifying this ${verificationType} `}
            <span style={{ color: '#555' }}>{verificationValue}</span> you need
            sign out.
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
            {`Oops, this ${verificationType} `}
            <span style={{ color: '#555' }}>{verificationValue}</span> verified
            already!
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
