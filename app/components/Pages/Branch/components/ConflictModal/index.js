import React from 'react'
import { Link, browserHistory } from 'react-router'
import RedirectModal from '../RedirectModal'

const ConflictModal = ({ params, brandInfo }) => {
  const { brandColor } = brandInfo
  const {
    action,
    loggedInUser,
    receivingUser,
    redirectTo,
    messageText
  } = params
  const { is_shadow } = receivingUser

  const actionButton = {
    text: 'Sign in',
    href: `/signout?username=${encodeURIComponent(
      receivingUser.email
    )}&redirectTo=${redirectTo}`
  }

  if (is_shadow) {
    if (action === 'RedirectToListing') {
      actionButton.text = 'Sign out'
    } else {
      actionButton.text = 'Register'
    }
    actionButton.href = `/signout?redirectFromSignout=${redirectTo}`
  }

  return (
    <RedirectModal brandInfo={brandInfo}>
      <div>
        <h3 className="c-confirm-modal__title">Conflict</h3>
        <p className="c-confirm-modal__message">{messageText}</p>
        <div>
          <Link
            to="/dashboard/mls"
            style={{ textDecoration: 'none' }}
            className="c-confirm-modal__button c-confirm-modal__button--ghost"
          >
            Cancel
          </Link>
          <a
            href={actionButton.href}
            style={{
              marginLeft: '2rem',
              textDecoration: 'none',
              backgroundColor: brandColor
            }}
            className="c-confirm-modal__button"
          >
            {actionButton.text}
          </a>
        </div>
      </div>
    </RedirectModal>
  )
}

export default ConflictModal
