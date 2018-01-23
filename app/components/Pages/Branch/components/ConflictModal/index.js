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
    messageText,
    actionButtonProps
  } = params
  const { is_shadow } = receivingUser

  const actionButton = actionButtonProps || {
    text: 'Sign in',
    href: `/signout?username=${encodeURIComponent(receivingUser.email)}&redirectTo=${redirectTo}`
  }

  if (is_shadow) {
    actionButton.text = 'Sign out'
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
