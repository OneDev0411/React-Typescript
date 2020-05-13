import React from 'react'
import { connect } from 'react-redux'
import compose from 'recompose/compose'
import withState from 'recompose/withState'
import withHandlers from 'recompose/withHandlers'
import { Modal } from 'react-bootstrap'
import Flex from 'styled-flex-component'

import createAlert from 'actions/listings/alerts/create-alert'
import ActionButton from 'components/Button/ActionButton'

import SuccessModal from './SuccessModal'
import ShareAlertModal from './ShareAlertModal'
import { normalizeAlertOptions } from './normalize-alert-options'

const CreateAlertModal = ({
  onHide,
  isActive,
  // internals
  isSaving,
  alertTitle,
  saveAlertHandler,
  titleInputOnChange,
  hideShareAlertModal,
  successModalIsActive,
  activeShareAlertModal,
  shareAlertModalIsActive
}) => (
  <div>
    <Modal
      show={isActive}
      onHide={isSaving ? () => {} : onHide}
      className="c-create-alert-modal"
    >
      <Modal.Body style={{ padding: 0 }}>
        <div className="c-create-alert-modal__hero">
          <svg width="48" height="48" xmlns="http://www.w3.org/2000/svg">
            <g fill="#000">
              <path d="M47 36c-2.756 0-5-2.242-5-5v-9c0-7.282-4.48-13.902-11.206-16.65A6.95 6.95 0 0 0 24 0c-3.224 0-6.048 2.262-6.8 5.35C10.478 8.098 6 14.716 6 22v9c0 2.758-2.244 5-5 5a1 1 0 0 0 0 2h46a1 1 0 0 0 0-2zM30 40H18a1 1 0 0 0-1 1c0 3.86 3.14 7 7 7s7-3.14 7-7a1 1 0 0 0-1-1z" />
            </g>
          </svg>
          <p style={{ marginBottom: 0 }}>Get new listings faster</p>
          <p style={{ marginBottom: 0 }}>than your local MLS®</p>
        </div>
        <div style={{ padding: '2rem' }}>
          <div>Alert Name</div>
          <input
            id="alertName"
            type="text"
            className="c-create-alert-modal__alert-title-input"
            placeholder="Naming your alert..."
            onChange={titleInputOnChange}
          />
        </div>
      </Modal.Body>
      <Modal.Footer
        style={{
          padding: '0.5em',
          borderRadius: '0 0 3px 3px',
          backgroundColor: '#FFF'
        }}
      >
        <Flex alignCenter justifyBetween>
          <ActionButton
            appearance="outline"
            size="small"
            onClick={saveAlertHandler}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save for me'}
          </ActionButton>
          <ActionButton
            size="small"
            appearance="outline"
            onClick={activeShareAlertModal}
            disabled={isSaving}
          >
            Save &amp; Share
          </ActionButton>
        </Flex>
      </Modal.Footer>
    </Modal>
    <SuccessModal
      type="SAVED_ALERT"
      text="Alert Saved"
      isActive={successModalIsActive}
    />
    <ShareAlertModal
      alertTitle={alertTitle}
      onHide={hideShareAlertModal}
      isActive={shareAlertModalIsActive}
    />
  </div>
)

export default compose(
  connect(
    ({ data, search }) => ({
      user: data.user,
      searchOptions: search.options,
      drawingPoints: search.map.drawing.points
    }),
    { createAlert }
  ),
  withState('isSaving', 'setIsSaving', false),
  withState('alertTitle', 'setAlertTitle', ''),
  withState('successModalIsActive', 'setSuccessModalIsActive', false),
  withState('shareAlertModalIsActive', 'setShareAlertModalIsActive', false),
  withHandlers({
    titleInputOnChange: ({ setAlertTitle }) => e => {
      setAlertTitle(e.target.value.trim())
    },
    saveAlertHandler: ({
      user,
      onHide,
      alertTitle,
      createAlert,
      setIsSaving,
      drawingPoints,
      searchOptions,
      alertProposedTitle,
      setSuccessModalIsActive
    }) => () => {
      setIsSaving(true)

      const alertOptions = normalizeAlertOptions(searchOptions, drawingPoints, {
        created_by: user.id,
        room: user.personal_room,
        title: alertTitle || alertProposedTitle
      })

      createAlert(alertOptions)
        .then(() => {
          setIsSaving(false)
          onHide()
          setSuccessModalIsActive(true)
          setTimeout(() => setSuccessModalIsActive(false), 2000)
        })
        .catch(() => {
          setIsSaving(false)
        })
    },
    hideShareAlertModal: ({ setShareAlertModalIsActive }) => () => {
      setShareAlertModalIsActive(false)
    },
    activeShareAlertModal: ({ onHide, setShareAlertModalIsActive }) => () => {
      onHide()
      setShareAlertModalIsActive(true)
    }
  })
)(CreateAlertModal)
