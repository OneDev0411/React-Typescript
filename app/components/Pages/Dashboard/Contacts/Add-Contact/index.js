import React from 'react'
import { connect } from 'react-redux'
import { Button, Modal } from 'react-bootstrap'
import { addNotification as notify } from 'reapop'
import { PhoneNumberUtil } from 'google-libphonenumber'
import Stage from '../components/Stage'
import Name from './Name'
import Emails from './Emails'
import Phones from './Phones'
import store from '../../../../../stores'
import { addContact } from '../../../../../store_actions/contact'

class AddContact extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showNewContactModal: false,
      saving: false,
      validationErrors: {},
      first_name: '',
      last_name: '',
      middle_name: '',
      stage: 'General',
      emails: [''],
      phones: [''],
      invalidFields: [],
      isFormCompleted: false
    }
  }

  openDialog() {
    this.setState({ showNewContactModal: true })
  }

  onChangeAttribute(attribute, key, value) {
    const stateName = `${attribute}s`
    const list = this.state[stateName]
    const field = {
      fieldValue: value,
      validatorName: attribute,
      fieldName: `${attribute}_${key}`
    }

    list[key] = value
    this.setState({ [stateName]: list }, () => this.validate(field))
  }

  addNewAttribute(attribute) {
    const stateName = `${attribute}s`
    const list = this.state[stateName]

    if (list.length >= this.multiple_limit) {
      return
    }

    list.push('')
    this.setState({ [stateName]: list })
  }

  onRemoveAttribute(attribute, key) {
    const stateName = `${attribute}s`
    const list = this.state[stateName]

    // remove
    list.splice(key, 1)
    this.setState({ [stateName]: list })
  }

  async save() {
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

      this.setState({ showNewContactModal: false })

      // trigger
      onNewContact(id)
    } catch (e) {
      if (e.response) {
        this.props.notify({
          message: e.response.body.message,
          status: 'error'
        })
      }
    } finally {
      this.setState({ saving: false })
    }
  }

  onHide() {
    this.setState({ showNewContactModal: false })
  }

  validate = async ({ fieldName, fieldValue, validatorName }) => {
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

  setFieldToState = field => {
    const { fieldName, fieldValue } = field

    this.setState({ [fieldName]: fieldValue }, () => this.validate(field))
  }

  hasData = () => {
    const requiredFields = ['first_name', 'last_name']

    return requiredFields.every(field => this.state[field])
  }

  render() {
    const {
      saving,
      showNewContactModal,
      first_name,
      middle_name,
      last_name,
      emails,
      phones,
      invalidFields
    } = this.state

    const isFormCompleted = this.hasData() && invalidFields.length === 0

    return (
      <div>
        <Button bsStyle="primary" onClick={() => this.openDialog()}>
          Add Contact
        </Button>

        <Modal
          dialogClassName="modal-add-contact"
          show={showNewContactModal}
          onHide={() => this.onHide()}
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
              attribute="email"
              invalidFields={invalidFields}
              errorMessage="Enter a valid email!"
              onAdd={this.addNewAttribute.bind(this)}
              onChange={this.onChangeAttribute.bind(this)}
              onRemove={this.onRemoveAttribute.bind(this)}
            />

            <Phones
              list={phones}
              attribute="phone"
              invalidFields={invalidFields}
              errorMessage="Enter a valid phone number!"
              onAdd={this.addNewAttribute.bind(this)}
              onChange={this.onChangeAttribute.bind(this)}
              onRemove={this.onRemoveAttribute.bind(this)}
            />
          </Modal.Body>

          <Modal.Footer>
            <Button
              bsStyle="primary"
              className="create-button"
              onClick={() => this.save()}
              disabled={saving || !isFormCompleted}
            >
              {saving ? 'Saving...' : 'Add'}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    )
  }
}

export default connect(null, { notify })(AddContact)

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
