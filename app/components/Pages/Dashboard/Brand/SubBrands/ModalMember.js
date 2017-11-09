import React from 'react'
import { Modal, Button } from 'react-bootstrap'
import cn from 'classnames'
import { compose, withState, pure } from 'recompose'
import Compose from '../../../../Partials/Compose'
import { hasRecipients } from '../../../../../utils/helpers'

const enhance = compose(
  pure,
  withState('showComposeModal', 'onChangeComposeModal', false),
  withState('recipients', 'onChangeRecipients', {}),
  withState('activeRoles', 'onChangeActiveRoles', [])
)

const ComposeWrapper = ({
  roles,
  TriggerButton,
  InitialValues,
  title,
  buttonTitle,
  onButtonClick,
  room = null,
  inline = false,
  dropDownBox = false,
  showOnly = false,
  working = false,
  /* internal props and states */
  showComposeModal,
  recipients,
  activeRoles,
  onChangeComposeModal,
  onChangeRecipients,
  onChangeActiveRoles
}) =>
  (
    <div style={{ display: inline ? 'inline' : 'block' }}>
      <TriggerButton
        clickHandler={() => onChangeComposeModal(!showComposeModal)}
      />

      <Modal
        show={showComposeModal}
        dialogClassName="chatroom-add-member"
        onHide={() => onChangeComposeModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {title}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {!showOnly &&
          <Compose
            dropDownBox={dropDownBox}
            onChangeRecipients={recipients => onChangeRecipients(recipients)}
          />}

          {InitialValues && <InitialValues />}
          <div
            id="popover-brand-user-avatar"
            style={{ marginTop: '8px' }}
          >
            <strong>Member Roles:</strong>
            {
              roles && roles.map((role, index) => {
                let active = activeRoles.indexOf(role.id) > -1

                return <div
                  key={index}
                  className="row-container"
                  onClick={() => {
                    let indexOf = activeRoles.indexOf(role.id)

                    if (indexOf > -1) {
                      activeRoles.splice(indexOf, 1)
                    } else {
                      activeRoles.push(role.id)
                    }

                    onChangeActiveRoles(activeRoles)
                  }}
                >
                  <i
                    className={cn('fa fa-check check-box-icon', { active })}
                    aria-hidden="true"
                  />
                  {role.role}
                </div>
              })
            }
          </div>
        </Modal.Body>

        {!showOnly &&
        <Modal.Footer>
          <Button
            bsStyle="primary"
            disabled={working
            || !hasRecipients(recipients)
            || activeRoles.length === 0
            }
            onClick={async () => {
              await onButtonClick(activeRoles, recipients)
              // reset states
              onChangeComposeModal(false)
              onChangeRecipients({})
              onChangeActiveRoles([])
            }}
          >
            {buttonTitle}
          </Button>
        </Modal.Footer>}
      </Modal>
    </div>
  )
export default enhance(ComposeWrapper)
