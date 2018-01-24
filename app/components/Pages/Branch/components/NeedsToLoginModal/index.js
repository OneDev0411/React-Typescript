import React from 'react'
import { Link } from 'react-router'
import RedirectModal from '../RedirectModal'

const NeedsToLoginModal = ({ params, brandInfo }) => {
  const { brandColor } = brandInfo
  const {
    receivingUser, redirectTo, email, branchUrl
  } = params

  const username = encodeURIComponent(email || receivingUser.email)

  return (
    <RedirectModal brandInfo={brandInfo}>
      <div>
        <h3 className="c-confirm-modal__title">Needs To Login</h3>
        <p className="c-confirm-modal__message">Please login first.</p>
        <div>
          <Link
            style={{
              marginLeft: '2rem',
              textDecoration: 'none',
              backgroundColor: brandColor
            }}
            className="c-confirm-modal__button"
            to={`/signin?username=${username}&redirectTo=${branchUrl}`}
          >
            Sign In
          </Link>
        </div>
      </div>
    </RedirectModal>
  )
}

export default NeedsToLoginModal
