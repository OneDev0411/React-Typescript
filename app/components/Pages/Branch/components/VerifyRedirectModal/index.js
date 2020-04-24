import React from 'react'

import RedirectModal from '../RedirectModal'
import { SigninButton } from '../SigninButton'
import Button from '../../../../../views/components/Button/LinkButton'

const VerifyRedirectModal = ({ type, params, brandInfo }) => {
  const { email, userInfo, redirectTo, verificationType } = params
  let signOutLink = `/signout?redirectFromSignout=/signin&redirectTo=${redirectTo}`

  const username = email || (userInfo && userInfo.email)

  if (username) {
    signOutLink = `${signOutLink}&username=${username}`
  }

  return (
    <RedirectModal brandInfo={brandInfo}>
      {type === 'VERIFYING_CONFLICT' ? (
        <div>
          <h3 className="c-confirm-modal__title">Verification Conflict</h3>
          <p className="c-confirm-modal__message">
            You are currently logged in as a different user. Please sign out to
            verify this account.
          </p>
          <div>
            <Button appearance="outline" to="/dashboard/mls">
              Cancel
            </Button>
            <SigninButton style={{ marginLeft: '0.5rem' }} href={signOutLink}>
              Sign out
            </SigninButton>
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
          <SigninButton href="/dashboard/mls">Go to the dashboard</SigninButton>
        </div>
      )}
    </RedirectModal>
  )
}

export default VerifyRedirectModal
