import React from 'react'
import { connect } from 'react-redux'
import { Modal } from 'react-bootstrap'
import compose from 'recompose/compose'
import withState from 'recompose/withState'
import withHandlers from 'recompose/withHandlers'

import Brand from '../../../../../../../controllers/Brand'
import SuccessModal from '../../../components/modals/SuccessModal'
import deleteAlert from '../../../../../../../store_actions/listings/alerts/delete-alert'

const brandColor = `#${Brand.color('primary', '3388ff')}`

const DeleteAlertModal = ({
  alert,
  onHide,
  // internals
  isDeleting,
  deleteHandler,
  successModalIsActive
}) =>
  <div>
    <Modal
      show={alert != null}
      onHide={isDeleting ? () => {} : onHide}
      className={`c-confirm-modal ${isDeleting && 'is-deleting'}`}
    >
      <Modal.Body>
        <h3 className="c-confirm-modal__title">Are you sure?</h3>
        <p className="c-confirm-modal__message">
          If you delete your alert, you will no longer get notified about its
          listings.
        </p>
        <div>
          <button
            onClick={onHide}
            disabled={isDeleting}
            className="c-confirm-modal__button c-confirm-modal__button--ghost"
          >
            Cancel
          </button>
          <button
            disabled={isDeleting}
            onClick={deleteHandler}
            style={{
              marginLeft: '2rem',
              backgroundColor: !isDeleting && brandColor
            }}
            className="c-confirm-modal__button"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </Modal.Body>
    </Modal>
    <SuccessModal
      type="SAVED_ALERT"
      text="Alert Deleted"
      isActive={successModalIsActive}
    />
  </div>

export default compose(
  connect(null, { deleteAlert }),
  withState('isDeleting', 'setIsDeleting', false),
  withState('successModalIsActive', 'setSuccessModalIsActive', false),
  withHandlers({
    deleteHandler: ({
      alert,
      onHide,
      isDeleting,
      deleteAlert,
      setIsDeleting,
      setSuccessModalIsActive
    }) => () => {
      if (alert == null) {
        return
      }
      setIsDeleting(true)

      deleteAlert(alert)
        .then(() => {
          setIsDeleting(false)
          onHide()
          setSuccessModalIsActive(true)
          setTimeout(() => setSuccessModalIsActive(false), 2000)
        })
        .catch(({ message }) => {
          setIsDeleting(false)
        })
    }
  })
)(DeleteAlertModal)
