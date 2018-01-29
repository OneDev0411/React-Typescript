import React from 'react'
import { connect } from 'react-redux'
import { Button, FormControl, Modal } from 'react-bootstrap'
import { addNotification as notify } from 'reapop'
import _ from 'underscore'
import RoleForm from './form'
import {
  createRoles,
  updateRole,
  selectRole
} from '../../../../../../store_actions/deals'
import AddToDealModal from '../../components/AddToDealModal'
import { getContactsList } from '../../../../../../reducers/contacts/list'

class UpsertRole extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      show: false,
      form: null,
      saving: false,
      isNewRecord: true,
      isFormCompleted: false,
      showAddToDealModal: false
    }

    this.showModal = this.showModal.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.handleOpenAddToDealModal = this.handleOpenAddToDealModal.bind(this)
    this.handleCloseAddToDealModal = this.handleCloseAddToDealModal.bind(this)
    this.addRoleWithExistingContactHandler = this.addRoleWithExistingContactHandler.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    const { selectedRole, allowedRoles } = nextProps
    const { form, show } = this.state

    if (selectedRole && !show && !form && !allowedRoles) {
      this.setState({
        form: selectedRole,
        isNewRecord: false,
        show: true
      })
    }
  }

  showModal() {
    this.setState({
      show: true,
      showAddToDealModal: false
    })
  }

  closeModal() {
    this.setState({
      show: false,
      isNewRecord: true,
      form: null
    })

    this.props.selectRole(null)
  }

  onFormChange({ form, isFormCompleted }) {
    this.setState({ form, isFormCompleted })
  }

  async upsert() {
    const { form, isNewRecord } = this.state
    const {
      deal, createRoles, updateRole, notify
    } = this.props

    if (!deal) {
      return false
    }

    this.setState({
      saving: true
    })

    try {
      if (isNewRecord) {
        await createRoles(deal.id, [form])
      } else {
        await updateRole(deal.id, _.omit(form, 'user'))
      }

      this.closeModal()
    } catch (e) {
      if (!e.response) {
        return notify({
          message: `Error: ${e.message}`,
          status: 'error'
        })
      }

      const { attributes } = e.response.body
      const field = attributes && Object.keys(attributes)[0]

      notify({
        message: `${field || 'entered data'} is invalid`,
        status: 'error'
      })
    }

    this.setState({
      saving: false
    })
  }

  handleOpenAddToDealModal() {
    this.setState({ showAddToDealModal: true })
  }

  handleCloseAddToDealModal() {
    this.setState({ showAddToDealModal: false })
  }

  addRoleWithExistingContactHandler(user) {
    const {
      legal_last_name, legal_first_name, last_name, first_name
    } = user

    const form = {
      legal_first_name: legal_first_name || first_name,
      legal_last_name: legal_last_name || last_name,
      ...user
    }

    this.setState({
      form,
      show: true,
      isNewRecord: true,
      showAddToDealModal: false
    })
  }

  render() {
    const {
      show,
      form,
      isNewRecord,
      saving,
      isFormCompleted,
      showAddToDealModal
    } = this.state
    const { deal, allowedRoles, contactsList } = this.props
    const buttonDisabled = !isFormCompleted || saving === true

    return (
      <div>
        <div className="item add-new" onClick={this.handleOpenAddToDealModal}>
          <img src="/static/images/deals/contact-add.png" />

          <div className="name">
            <div style={{ color: '#61778d' }}>Add a Contact</div>
          </div>
        </div>

        <AddToDealModal
          isOpen={showAddToDealModal}
          contactsList={contactsList}
          addManuallyHandler={this.showModal}
          closeHandler={this.handleCloseAddToDealModal}
          selectedItemHandler={this.addRoleWithExistingContactHandler}
        />

        <Modal
          show={show}
          onHide={this.closeModal}
          backdrop="static"
          dialogClassName="modal-deal-add-role"
        >
          <Modal.Header closeButton>
            {isNewRecord ? 'Add Contact' : 'Update Contact'}
          </Modal.Header>

          <Modal.Body>
            <RoleForm
              deal={deal}
              form={form}
              allowedRoles={allowedRoles}
              onFormChange={data => this.onFormChange(data)}
            />
          </Modal.Body>

          <Modal.Footer>
            <Button
              className={`btn-deal ${buttonDisabled ? 'disabled' : ''}`}
              bsStyle={buttonDisabled ? 'link' : 'primary'}
              disabled={buttonDisabled}
              onClick={() => this.upsert()}
            >
              {saving ? 'Saving...' : isNewRecord ? 'Add' : 'Update'}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    )
  }
}

function mapToProps({ deals, contacts }) {
  const { selectedRole } = deals
  const contactsList = getContactsList(contacts)

  return {
    selectedRole,
    contactsList
  }
}

export default connect(mapToProps, {
  selectRole,
  createRoles,
  updateRole,
  notify
})(UpsertRole)
