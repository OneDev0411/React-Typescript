import React from 'react'

import RedirectModal from '../RedirectModal'
import { SigninButton } from '../SigninButton'

const NeedsToLoginModal = ({ params, brandInfo }) => {
  const { userInfo, email, branchUrl } = params
  let queryStrings = `?redirectTo=${branchUrl}`
  const username = email || (userInfo && userInfo.email)

  if (username) {
    queryStrings = `${queryStrings}&username=${username}`
  }

  return (
    <RedirectModal brandInfo={brandInfo}>
      <div>
        <h3 className="c-confirm-modal__title">Needs To Login</h3>
        <p className="c-confirm-modal__message">Please login first.</p>
        <div>
          <SigninButton href={`/signin${queryStrings}`}>Sign In</SigninButton>
        </div>
      </div>
    </RedirectModal>
  )
}

export default NeedsToLoginModal
