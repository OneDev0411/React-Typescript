import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Button } from 'react-bootstrap'
import cn from 'classnames'

class ModalNewRole extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showComposeModal: false,
      title: props.role && props.role.role,
      acl: (props.role && props.role.acl) || []
    }
    this.onChangeComposeModal = this.onChangeComposeModal.bind(this)
    this.handleChangeInput = this.handleChangeInput.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.role && nextProps.activeItem) {
      this.setState({
        title: nextProps.role.role,
        acl: nextProps.role.acl
      })
    }
  }

  onChangeComposeModal(showComposeModal) {
    this.setState({ showComposeModal })
  }

  handleChangeInput(e) {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  render() {
    const {
      TriggerButton,
      buttonTitle,
      onButtonClick,
      title: titleModal,
      aclTypes
      /* internal props and states */
    } = this.props
    const { showComposeModal, title, acl } = this.state

    return (
      <div style={{ display: 'inline' }}>
        <TriggerButton
          clickHandler={() => this.onChangeComposeModal(!showComposeModal)}
        />

        <Modal
          show={showComposeModal}
          dialogClassName="modal-checklist"
          onHide={() => this.onChangeComposeModal(false)}
        >
          <Modal.Header closeButton>
            <Modal.Title>{titleModal}</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <div className="row-container">
              <div className="title">Title</div>
              <div className="input-container">
                <input
                  type="text"
                  name="title"
                  placeholder="Give the role a name…"
                  value={title}
                  onChange={this.handleChangeInput}
                />
              </div>
              <div className="title">Roles:</div>
              {aclTypes.map(permission => {
                let active = acl && acl.indexOf(permission) > -1

                return (
                  <span key={permission}>
                    <Button
                      className={cn('checkBoxIcon', { active })}
                      onClick={() => {
                        if (active) {
                          acl.splice(acl.indexOf(permission), 1)
                        } else {
                          acl.push(permission)
                        }

                        this.setState({ acl })
                      }}
                    >
                      <i className="fa fa-check" aria-hidden="true" />
                    </Button>
                    <span className="checkBoxText">{permission}</span>
                  </span>
                )
              })}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              disabled={!title}
              bsStyle="primary"
              onClick={async () => {
                this.onChangeComposeModal(false)
                onButtonClick({
                  role: title,
                  acl
                })
              }}
            >
              {buttonTitle}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    )
  }
}

ModalNewRole.propTypes = {
  role: PropTypes.object,
  activeItem: PropTypes.bool,
  TriggerButton: PropTypes.func,
  buttonTitle: PropTypes.string,
  onButtonClick: PropTypes.func,
  title: PropTypes.string,
  aclTypes: PropTypes.array
}

export default ModalNewRole
