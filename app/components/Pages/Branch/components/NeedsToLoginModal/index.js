import React from 'react'

import RedirectModal from '../RedirectModal'
import { SigninButton } from '../SigninButton'

const NeedsToLoginModal = ({ params, brandInfo }) => {
  const { receivingUser, email, branchUrl } = params

  const username = encodeURIComponent(email || receivingUser.email)

  return (
    <RedirectModal brandInfo={brandInfo}>
      <div>
        <h3 className="c-confirm-modal__title">Needs To Login</h3>
        <p className="c-confirm-modal__message">Please login first.</p>
        <div>
          <SigninButton
            appearance="primary"
            to={`/signin?username=${username}&redirectTo=${branchUrl}`}
          >
            Sign In
          </SigninButton>
        </div>
      </div>
    </RedirectModal>
  )
}

export default NeedsToLoginModal
