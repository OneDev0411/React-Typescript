import React from 'react'
import { connect } from 'react-redux'
import { Modal, Button } from 'react-bootstrap'
import { compose, withState, pure } from 'recompose'
import Compose from '../../../../Partials/Compose'
import { hasRecipients } from '../../../../../utils/helpers'
import AutoSizeInput from '../../../../Partials/AutoSizeInput'

const enhance = compose(
  pure,
  withState('showComposeModal', 'onChangeComposeModal', false),
  withState('recipients', 'onChangeRecipients', {})
)

const ComposeWrapper = ({
                          TriggerButton,
                          title,
                          buttonTitle,
                          onButtonClick,
                          inline = false,
                          showOnly = false,
                          /* internal props and states */
                          showComposeModal,
                          recipients,
                          onChangeComposeModal,
                        }) => {
  const setInputRef = (el) => {
    this.input = el
  }

  return <div style={{ display: inline ? 'inline' : 'block' }}>
    <TriggerButton
      clickHandler={() => onChangeComposeModal(!showComposeModal)}
    />

    <Modal
      show={showComposeModal}
      dialogClassName="modal-new-role"
      onHide={() => onChangeComposeModal(false)}
    >
      <Modal.Header closeButton>
        <Modal.Title>
          {title}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="row-container">
          <div className="title">Title</div>
          <div className="input-container">
            <input
              type="text"
              placeholder='Give the role a name…'
              ref={el => setInputRef(el)}
            />
          </div>
        </div>
        <div className="description">Accurate titles help with context when glancing through your checklist.</div>
      </Modal.Body>

      {!showOnly &&
      <Modal.Footer>
        <Button
          bsStyle="primary"
          onClick={async () => {
            onButtonClick({
              role: this.input.value
            })
          }}
        >
          {buttonTitle}
        </Button>
      </Modal.Footer>}
    </Modal>
  </div>
}
export default enhance(ComposeWrapper)
