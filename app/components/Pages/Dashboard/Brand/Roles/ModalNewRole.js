import React from 'react'
import { Modal, Button } from 'react-bootstrap'
import { compose, withState, pure } from 'recompose'

const enhance = compose(
  pure,
  withState('showComposeModal', 'onChangeComposeModal', false),
  withState('recipients', 'onChangeRecipients', {})
)

const ModalNewRole = ({
  TriggerButton,
  title,
  buttonTitle,
  onButtonClick,
  inline = false,
  showOnly = false,
  /* internal props and states */
  showComposeModal,
  onChangeComposeModal
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
              placeholder="Give the role a name…"
              ref={el => setInputRef(el)}
            />
          </div>
        </div>
      </Modal.Body>

      {!showOnly &&
      <Modal.Footer>
        <Button
          bsStyle="primary"
          onClick={async () => {
            onChangeComposeModal(false)
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
export default enhance(ModalNewRole)
