import React from 'react'

import RedirectModal from '../RedirectModal'
import LinkButton from '../../../../../views/components/Button/LinkButton'
import ActionButton from '../../../../../views/components/Button/ActionButton'
import { SigninButton } from '../SigninButton'

const ConflictModal = ({ params, brandInfo }) => {
  let {
    to,
    email,
    userInfo,
    redirectTo,
    messageText,
    actionButtonProps
  } = params
  let is_shadow

  if (userInfo) {
    is_shadow = userInfo.is_shadow
  }

  email = email || (userInfo && userInfo.email)

  const actionButton = actionButtonProps || {
    text: 'Sign in',
    href: `/signout?username=${email}&redirectTo=${redirectTo}`
  }

  if (is_shadow) {
    actionButton.text = 'Sign out'
    actionButton.href = to
  }

  return (
    <RedirectModal brandInfo={brandInfo}>
      <div>
        <h3 className="c-confirm-modal__title">Conflict</h3>
        <p
          className="c-confirm-modal__message"
          style={{ marginBottom: '2rem' }}
        >
          {messageText}
        </p>
        <div>
          <LinkButton
            appearance="outline"
            to="/dashboard/mls"
            style={{ marginRight: '1rem' }}
          >
            Cancel
          </LinkButton>
          {actionButton.href ? (
            <SigninButton href={actionButton.href}>
              {actionButton.text}
            </SigninButton>
          ) : (
            <ActionButton {...actionButton}>{actionButton.text}</ActionButton>
          )}
        </div>
      </div>
    </RedirectModal>
  )
}

export default ConflictModal
