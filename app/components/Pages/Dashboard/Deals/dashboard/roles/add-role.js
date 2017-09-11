import React from 'react'
import { connect } from 'react-redux'
import { Row, Col, Button, FormControl, Modal } from 'react-bootstrap'
import _ from 'underscore'
import RoleForm from './form'
import { createRole } from '../../../../../../store_actions/deals'

class AddRole extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      show: false,
      form: null,
      saving: false
    }
  }

  showModal() {
    this.setState({ show: true })
  }

  closeModal() {
    this.setState({ show: false })
  }

  async create() {
    const { form } = this.state
    const { dealId, createRole } = this.props

    this.setState({
      saving: true
    })

    try {
      await createRole(dealId, form)
      this.setState({ show: false })
    } catch (e) {

    }

    this.setState({
      saving: false
    })
  }

  render() {
    const { show, form, saving } = this.state

    return (
      <div>
        <Row
          className="item add-new"
          onClick={() => this.showModal()}
        >
          <Col sm={2} xs={3} className="vcenter">
            <span className="add-contact-avatar">
              <i className="fa fa-plus" />
            </span>
          </Col>

          <Col sm={10} xs={9} className="name vcenter">
            <div style={{ color: '#61778d' }}>
              Add Contact
            </div>
          </Col>
        </Row>

        <Modal
          show={show}
          onHide={() => this.closeModal()}
          dialogClassName="modal-deal-add-role"
        >
          <Modal.Header closeButton>
            <Modal.Title>Add new role</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <RoleForm
              onFormCompleted={form => this.setState({ form })}
            />
          </Modal.Body>

          <Modal.Footer>
            <Button
              disabled={form === null || saving === true}
              onClick={() => this.create()}
            >
              Add Role
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    )
  }
}

export default connect(null, { createRole })(AddRole)
