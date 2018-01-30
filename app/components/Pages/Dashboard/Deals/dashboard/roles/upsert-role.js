import React from 'react'
import { connect } from 'react-redux'
import { Button, Modal } from 'react-bootstrap'
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

const initialState = {
  form: null,
  show: false,
  saving: false,
  isFormCompleted: false,
  showAddToDealModal: false
}

class UpsertRole extends React.Component {
  state = initialState

  componentWillReceiveProps = nextProps => {
    const { form, show } = this.state
    const { selectedRole, allowedRoles } = nextProps

    if (selectedRole && !show && !form && !allowedRoles) {
      this.setState({
        form: selectedRole,
        show: true
      })
    }
  }

  componentWillUnmount = () => {
    this.setState(initialState)
    this.props.selectRole(null)
  }

  showModal = () => {
    this.setState({
      show: true,
      showAddToDealModal: false
    })
  }

  closeModal = () => {
    this.setState(initialState)
    this.props.selectRole(null)
  }

  onFormChange = ({ form, isFormCompleted }) => {
    this.setState({ form, isFormCompleted })
  }

  upsert = async () => {
    const { form } = this.state
    const {
      deal, createRoles, updateRole, notify, selectedRole
    } = this.props

    if (!deal) {
      return false
    }

    this.setState({
      saving: true
    })

    console.log(form)

    try {
      if (selectedRole) {
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

  handleOpenAddToDealModal = () => {
    this.setState({ showAddToDealModal: true })
  }

  handleCloseAddToDealModal = () => {
    this.setState({ showAddToDealModal: false })
  }

  addRoleWithExistingContactHandler = user => {
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
      showAddToDealModal: false
    })
  }

  setSubmitButtonText = () => {
    const { saving } = this.state
    const { selectedRole } = this.props

    let text = selectedRole ? 'Update' : 'Add'

    if (saving) {
      return selectedRole ? 'Updating...' : 'Adding...'
    }

    return text
  }

  render() {
    const {
      show, form, saving, isFormCompleted, showAddToDealModal
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
          <Modal.Header closeButton>Add to Deal</Modal.Header>

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
              onClick={this.upsert}
            >
              {this.setSubmitButtonText()}
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
