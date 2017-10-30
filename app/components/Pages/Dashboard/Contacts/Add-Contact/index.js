import React from 'react'
import { Button, Modal, FormControl } from 'react-bootstrap'
import Stage from '../components/Stage'
import Emails from './Emails'
import Phones from './Phones'
import store from '../../../../../stores'
import { addContact } from '../../../../../store_actions/contact'

export default class AddContact extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showNewContactModal: false,
      saving: false,
      validationErrors: {},
      firstName: '',
      lastName: '',
      stage: 'General',
      emails: [''],
      phones: ['']
    }
  }

  openDialog() {
    this.setState({ showNewContactModal: true })
  }

  onChangeAttribute(e, attribute, key) {
    const stateName = `${attribute}s`
    const list = this.state[stateName]

    list[key] = e.target.value
    this.setState({ [stateName]: list })
  }

  addNewAttribute(attribute) {
    const stateName = `${attribute}s`
    const list = this.state[stateName]

    if (list.length >= this.multiple_limit)
      return

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
    const { firstName, lastName, stage, phones, emails } = this.state
    const { onNewContact, dispatch } = this.props

    this.setState({ saving: true })

    try {
      const contact = {
        emails,
        phone_numbers: phones,
        first_name: firstName,
        last_name: lastName,
        stage
      }

      const id = await store.dispatch(addContact(contact))

      this.setState({ showNewContactModal: false })

      // trigger
      onNewContact(id)
    } catch (e) {
      console.log(e)
      if (e.response) {
        alert(e.response.body.message)
        // this.setState({
        //   validationErrors: e.response.body.attributes
        // })
      }
    } finally {
      this.setState({ saving: false })
    }
  }

  onHide() {
    this.setState({ showNewContactModal: false })
  }

  render() {
    const {
      saving,
      showNewContactModal,
      validationErrors,
      firstName,
      lastName,
      emails,
      phones
    } = this.state

    return (
      <div>
        <Button
          bsStyle="primary"
          onClick={() => this.openDialog()}
        >
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

            <Stage
              default="General"
              onChange={stage => this.setState({ stage })}
            />

            <div className="fullname">
              <FormControl
                value={firstName}
                onChange={e => this.setState({ firstName: e.target.value })}
                placeholder="First Name"
              />
              <FormControl
                value={lastName}
                onChange={e => this.setState({ lastName: e.target.value })}
                placeholder="Last Name"
              />
            </div>

            <Emails
              list={emails}
              validationErrors={validationErrors}
              attribute="email"
              onAdd={this.addNewAttribute.bind(this)}
              onChange={this.onChangeAttribute.bind(this)}
              onRemove={this.onRemoveAttribute.bind(this)}
            />

            <Phones
              list={phones}
              validationErrors={validationErrors}
              attribute="phone"
              onAdd={this.addNewAttribute.bind(this)}
              onChange={this.onChangeAttribute.bind(this)}
              onRemove={this.onRemoveAttribute.bind(this)}
            />

          </Modal.Body>

          <Modal.Footer>
            <Button
              bsStyle="primary"
              onClick={() => this.save()}
              disabled={saving}
            >
              { saving ? 'Saving...' : 'Add' }
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    )
  }
}
