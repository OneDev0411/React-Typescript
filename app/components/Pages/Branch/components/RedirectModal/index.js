import React from 'react'
import { Link } from 'react-router'

import { Modal, ModalContent } from 'components/Modal'

const RedirectModal = ({ children, brandInfo }) => {
  const { siteLogo, siteTitle } = brandInfo

  return (
    <div>
      <Modal isOpen autoHeight className="c-confirm-modal">
        <ModalContent>
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
        </ModalContent>
      </Modal>
    </div>
  )
}

export default RedirectModal
