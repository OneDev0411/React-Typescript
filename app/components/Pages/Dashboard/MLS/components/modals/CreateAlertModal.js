import React from 'react'

import { mdiBell } from '@mdi/js'
import { connect } from 'react-redux'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import withState from 'recompose/withState'
import Flex from 'styled-flex-component'

import createAlert from '@app/store_actions/listings/alerts/create-alert'
import ActionButton from '@app/views/components/Button/ActionButton'
import { Modal, ModalFooter } from '@app/views/components/Modal'
import { muiIconSizes } from '@app/views/components/SvgIcons/icon-sizes'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'

import { normalizeAlertOptions } from './normalize-alert-options'
import ShareAlertModal from './ShareAlertModal'
import SuccessModal from './SuccessModal'

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
  shareAlertModalIsActive,
  searchOptions,
  drawingPoints
}) => (
  <div>
    <Modal
      isOpen={isActive}
      autoHeight
      onRequestClose={isSaving ? () => {} : onHide}
      className="c-create-alert-modal"
    >
      <>
        <div className="c-create-alert-modal__hero">
          <SvgIcon path={mdiBell} size={muiIconSizes.xlarge} />
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
      </>
      <ModalFooter
        style={{
          padding: '0.5em',
          borderRadius: '0 0 3px 3px',
          backgroundColor: '#FFF'
        }}
      >
        <Flex alignCenter justifyBetween style={{ width: '100%' }}>
          <ActionButton
            appearance="outline"
            size="small"
            onClick={saveAlertHandler}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save for me'}
          </ActionButton>
        </Flex>
      </ModalFooter>
    </Modal>
    <SuccessModal
      type="SAVED_ALERT"
      text="Alert Saved"
      isActive={successModalIsActive}
    />
    <ShareAlertModal
      searchOptions={searchOptions}
      drawingPoints={drawingPoints}
      alertTitle={alertTitle}
      onHide={hideShareAlertModal}
      isActive={shareAlertModalIsActive}
    />
  </div>
)

export default compose(
  connect(
    ({ user }) => ({
      user
    }),
    { createAlert }
  ),
  withState('isSaving', 'setIsSaving', false),
  withState('alertTitle', 'setAlertTitle', ''),
  withState('successModalIsActive', 'setSuccessModalIsActive', false),
  withState('shareAlertModalIsActive', 'setShareAlertModalIsActive', false),
  withHandlers({
    titleInputOnChange:
      ({ setAlertTitle }) =>
      e => {
        setAlertTitle(e.target.value.trim())
      },
    saveAlertHandler:
      ({
        user,
        onHide,
        alertTitle,
        createAlert,
        setIsSaving,
        drawingPoints,
        searchOptions,
        alertProposedTitle,
        setSuccessModalIsActive
      }) =>
      () => {
        setIsSaving(true)

        const alertOptions = normalizeAlertOptions(
          searchOptions,
          drawingPoints,
          {
            created_by: user.id,
            room: user.personal_room,
            title: alertTitle || alertProposedTitle
          }
        )

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
    hideShareAlertModal:
      ({ setShareAlertModalIsActive }) =>
      () => {
        setShareAlertModalIsActive(false)
      },
    activeShareAlertModal:
      ({ onHide, setShareAlertModalIsActive }) =>
      () => {
        onHide()
        setShareAlertModalIsActive(true)
      }
  })
)(CreateAlertModal)
