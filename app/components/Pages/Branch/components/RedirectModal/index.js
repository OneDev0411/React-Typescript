import React from 'react'
import { Link } from 'react-router'
import { Modal } from 'react-bootstrap'

const RedirectModal = ({ children, brandInfo }) => {
  const { siteLogo, siteTitle } = brandInfo

  return (
    <div>
      <Modal show className="c-confirm-modal">
        <Modal.Body>
          <header className="c-auth__header">
            {siteLogo && (
              <Link to="/" tabIndex={-1}>
                <img
                  src={siteLogo}
                  alt={`${siteTitle}`}
                  className="c-auth__logo"
                />
              </Link>
            )}
          </header>
          {children}
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default RedirectModal
