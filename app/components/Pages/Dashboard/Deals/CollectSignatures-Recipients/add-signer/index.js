import React from 'react'
import { Row, Col, Modal, FormControl, Button } from 'react-bootstrap'
import cn from 'classnames'
import S from 'shorti'
import _ from 'underscore'

export default class extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      show: false,
      firstName: '',
      lastName: '',
      email: '',
      role: ''
    }
  }

  addSigner() {
    this.setState({
      show: true,
      firstName: this.props.firstName || '',
      lastName: this.props.lastName || '',
      email: this.props.email || ''
    })
  }

  onRoleChange(role) {
    this.setState({
      role
    })
  }

  onSubmit() {
    const { firstName, lastName, email, role } = this.state

    if (!email || !role)
      return

    if (this.props.onSubmit)
      this.props.onSubmit({ firstName, lastName, email, role })

    this.setState({
      show: false,
      firstName: '',
      lastName: '',
      email: '',
      role: ''
    })
  }

  render() {
    const { email, role } = this.state

    return (
      <div>
        <div onClick={this.addSigner.bind(this)}>
          { this.props.children }
        </div>

        <Modal
          dialogClassName="modal-fullscreen"
          show={this.state.show}
          onHide={() => this.setState({ show: false })}
        >
          <Modal.Body>
            <Modal.Header closeButton>
              <Modal.Title>Add New Role</Modal.Title>
            </Modal.Header>
            <div className="add-signer-form">

              <Row>
                <Col xs={6} style={S('pr-0')}>
                  <FormControl
                    type="text"
                    placeholder="First Name"
                    value={this.state.firstName}
                    onChange={e => this.setState({ firstName: e.target.value })}
                  />
                </Col>
                <Col xs={6} style={S('pl-0')}>
                  <FormControl
                    type="text"
                    placeholder="Last Name"
                    value={this.state.lastName}
                    onChange={e => this.setState({ lastName: e.target.value })}
                  />
                </Col>
              </Row>

              <Row style={S('mt-10')}>
                <Col xs={12}>
                  <FormControl
                    type="text"
                    placeholder="Email"
                    value={this.state.email}
                    onChange={e => this.setState({ email: e.target.value })}
                  />
                </Col>
              </Row>

              <div className="assign-role">
                Assign a role
                <ul>
                  {
                    _.map(this.props.roles, (role, key) => (
                      <li
                        key={`rl_${key}`}
                        onClick={this.onRoleChange.bind(this, role)}
                        className={cn({ selected: role === this.state.role })}
                      >
                        { role }
                      </li>
                      ))
                  }
                </ul>
              </div>

              <div style={{ textAlign: 'right', marginTop: '30px' }}>
                <Button
                  bsStyle="primary"
                  onClick={this.onSubmit.bind(this)}
                  disabled={!email || !role}
                >
                  Add
                </Button>
              </div>

            </div>
          </Modal.Body>
        </Modal>
      </div>
    )
  }
}
