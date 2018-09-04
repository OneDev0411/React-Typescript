import React from 'react'

import RedirectModal from '../RedirectModal'
import Button from '../../../../../views/components/Button/LinkButton'
import { SigninButton } from '../SigninButton'

const ConflictModal = ({ params, brandInfo }) => {
  const { receivingUser, redirectTo, messageText, actionButtonProps } = params
  const { is_shadow } = receivingUser

  const actionButton = actionButtonProps || {
    text: 'Sign in',
    href: `/signout?username=${encodeURIComponent(
      receivingUser.email
    )}&redirectTo=${redirectTo}`
  }

  if (is_shadow) {
    actionButton.text = 'Sign out'
    actionButton.href = `/signout?redirectFromSignout=${redirectTo}`
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
          <Button appearance="outline" to="/dashboard/mls">
            Cancel
          </Button>
          <SigninButton appearance="primary" to={actionButton.href}>
            {actionButton.text}
          </SigninButton>
        </div>
      </div>
    </RedirectModal>
  )
}

export default ConflictModal
