import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import update from 'react-addons-update'
import { Button, Modal } from 'react-bootstrap'
import { addNotification as notify } from 'reapop'
import { PhoneNumberUtil } from 'google-libphonenumber'
import Stage from '../components/Stage'
import Name from './Name'
import Emails from './Emails'
import Phones from './Phones'
import store from '../../../../../stores'
import { addContact } from '../../../../../store_actions/contact'

const INITIAL_STATE = {
  stage: 'General',
  first_name: '',
  middle_name: '',
  last_name: '',
  emails: [''],
  phones: [''],
  saving: false,
  invalidFields: [],
  isFormCompleted: false,
  isOpen: false
}

class AddContactModal extends React.Component {
  constructor(props) {
    super(props)

    this.state = INITIAL_STATE
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleOpenModal = () => {
    this.setState({ isOpen: true })
  }

  handlOnClose = () => {
    this.setState(INITIAL_STATE)
  }

  async validate({ fieldName, fieldValue, validatorName }) {
    const { invalidFields } = this.state

    const isValidName = name =>
      name && name.trim().length > 0 && new RegExp(/^[A-Za-z\s]+$/).exec(name)

    const fields = {
      email: email => email && isEmail(email),
      last_name: name => isValidName(name),
      first_name: name => isValidName(name),
      middle_name: name => isValidName(name),
      phone: phoneNumber => phoneNumber && isPhoneNumber(phoneNumber)
    }

    // validate field
    const validator = fields[validatorName || fieldName]

    let newInvalidFields = invalidFields

    const removeField = () => {
      newInvalidFields = invalidFields.filter(f => fieldName !== f)
      this.setState({
        invalidFields: newInvalidFields
      })
    }

    if (fieldValue) {
      if (typeof validator === 'function' && (await validator(fieldValue))) {
        // validated! so remove field from invalidFields
        if (invalidFields.length > 0 && invalidFields.includes(fieldName)) {
          removeField()
        }
      } else if (!invalidFields.includes(fieldName)) {
        // add field to invalidfields
        newInvalidFields = [...invalidFields, fieldName]
        this.setState({
          invalidFields: newInvalidFields
        })
      }
    } else if (invalidFields.includes(fieldName)) {
      removeField()
    }
  }

  handleOnChangeAttribute = (name, index, value) => {
    const attributeName = `${name}s`
    const attribute = update(this.state[attributeName], { $splice: [[index, 1]] })
    const newAttribute = [...attribute, value]

    const fieldForValidator = {
      fieldValue: value,
      validatorName: name,
      fieldName: `${name}_${index}`
    }

    this.setState({ [attributeName]: newAttribute }, () =>
      this.validate(fieldForValidator))
  }

  handleAddNewAttribute = attributeName => {
    const fieldName = `${attributeName}s`

    // The empty string value that have been added,
    // it is just to mapping over the items for generate item in react.
    this.setState(prevState => ({
      [fieldName]: [...prevState[fieldName], '']
    }))
  }

  handleRemoveAttribute = (attributeName, index) => {
    const fieldName = `${attributeName}s`

    this.setState(prevState => ({
      [fieldName]: update(prevState[fieldName], { $splice: [[index, 1]] })
    }))
  }

  async handleSubmit() {
    const {
      first_name, middle_name, last_name, stage, phones, emails
    } = this.state
    const { onNewContact } = this.props

    this.setState({ saving: true })

    try {
      const contact = {
        emails,
        phone_numbers: phones,
        first_name,
        last_name,
        middle_name,
        stage
      }

      const id = await store.dispatch(addContact(contact))

      this.setState(INITIAL_STATE)

      // trigger
      onNewContact(id)
    } catch (e) {
      if (e.response) {
        this.props.notify({
          message: e.response.body.message,
          status: 'error'
        })
      }
    }
  }

  setFieldToState = field => {
    const { fieldName, fieldValue } = field

    this.setState({ [fieldName]: fieldValue }, () => this.validate(field))
  }

  hasData = () => {
    const requiredFields = ['first_name', 'last_name']

    return requiredFields.every(field => this.state[field])
  }

  render = () => {
    const {
      saving,
      isOpen,
      first_name,
      middle_name,
      last_name,
      emails,
      phones,
      invalidFields
    } = this.state

    const isFormCompleted = this.hasData() && invalidFields.length === 0

    return (
      <Fragment>
        <Button bsStyle="primary" onClick={this.handleOpenModal}>
          Add Contact
        </Button>

        <Modal
          dialogClassName="modal-add-contact"
          show={isOpen}
          onHide={this.handlOnClose}
        >
          <Modal.Body>
            <Modal.Header closeButton>
              <Modal.Title>New Contact</Modal.Title>
            </Modal.Header>

            <Stage default="General" onChange={stage => this.setState({ stage })} />

            <div className="fullname">
              <Name
                id="first_name"
                name="first_name"
                placeholder="First Name *"
                value={first_name}
                isInvalid={invalidFields.includes('first_name')}
                onChange={first_name =>
                  this.setFieldToState({
                    fieldName: 'first_name',
                    fieldValue: first_name
                  })
                }
              />
              <Name
                id="middle_name"
                name="middle_name"
                placeholder="Middle Name"
                value={middle_name}
                isInvalid={invalidFields.includes('middle_name')}
                onChange={middle_name =>
                  this.setFieldToState({
                    fieldName: 'middle_name',
                    fieldValue: middle_name
                  })
                }
              />
              <Name
                id="last_name"
                name="last_name"
                placeholder="last Name *"
                value={last_name}
                isInvalid={invalidFields.includes('last_name')}
                onChange={last_name =>
                  this.setFieldToState({
                    fieldName: 'last_name',
                    fieldValue: last_name
                  })
                }
              />
            </div>

            <Emails
              list={emails}
              attributeName="email"
              invalidFields={invalidFields}
              errorMessage="Enter a valid email!"
              onAdd={this.handleAddNewAttribute}
              onChange={this.handleOnChangeAttribute}
              onRemove={this.handleRemoveAttribute}
            />

            <Phones
              list={phones}
              attributeName="phone"
              invalidFields={invalidFields}
              errorMessage="Enter a valid phone number!"
              onAdd={this.handleAddNewAttribute}
              onChange={this.handleOnChangeAttribute}
              onRemove={this.handleRemoveAttribute}
            />
          </Modal.Body>

          <Modal.Footer>
            <Button
              bsStyle="primary"
              className="create-button"
              onClick={this.handleSubmit}
              disabled={saving || !isFormCompleted}
            >
              {saving ? 'Saving...' : 'Add'}
            </Button>
          </Modal.Footer>
        </Modal>
      </Fragment>
    )
  }
}

export default connect(null, { notify })(AddContactModal)

/**
 * validate email
 */
function isEmail(email) {
  return new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/).exec(email)
}

/**
 * validate phone number
 */
function isPhoneNumber(phoneNumber) {
  const phoneUtil = PhoneNumberUtil.getInstance()

  try {
    return phoneUtil.isValidNumber(phoneUtil.parse(phoneNumber, 'US'))
  } catch (e) {
    return false
  }
}
