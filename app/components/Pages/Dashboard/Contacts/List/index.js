import React from 'react'
import { Grid, Row, Col, Button } from 'react-bootstrap'
import Avatar from 'react-avatar'
import _ from 'underscore'

export default class ContactsList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      contacts: []
    }
  }

  componentDidMount() {
    const { contacts } = this.props

    if (contacts)
      this.setState({ contacts })
  }

  componentWillReceiveProps(nextProps) {
    const { contacts } = nextProps

    if (contacts && contacts.length > this.state.contacts.length)
      this.setState({ contacts })
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { contacts } = nextProps
    return contacts && contacts.length > this.state.contacts.length
  }

  addContact() {

  }

  getDisplayName(contact) {
    const max = 20
    const name = contact.display_name.trim()
    return name.length < max ? name : name.substr(0, max) + ' ...'
  }

  getAvatar(contact) {
    if (!contact.users)
      return

    return contact.users[0].cover_image_url
  }

  getEmail(contact) {
    return this.getValue(contact, 'emails', 'email')
  }

  getSourceType(contact) {
    return this.getValue(contact, 'source_types', 'source_type')
  }

  getPhoneNumber(contact) {
    return this.getValue(contact, 'phone_numbers', 'phone_number')
  }

  getStage(contact) {
    return this.getValue(contact, 'stages', 'stage')
  }

  getValue(contact, attribute, field) {
    const attrs = contact.sub_contacts[0].attributes
    if (!attrs || !attrs[attribute])
      return ''

    return attrs[attribute][0][field]
  }

  render() {
    const { contacts } = this.state

    return (
      <div className="list">

        <Row className="toolbar">
          <Col lg={2} md={2} sm={2} className="vcenter">
            <span className="title">Contacts</span>
          </Col>

          <Col lg={4} md={4} sm={4} className="vcenter">
            { contacts.length } total
          </Col>

          <Col lg={6} md={6} sm={6} className="vcenter right">

            <Button
              bsStyle="primary"
              onClick={this.addContact.bind(this, 'offer')}
              disabled={true}
            >
              Add Contact
            </Button>
          </Col>
        </Row>

        {
          contacts.length > 0 &&
          <Grid className="table">
            <Row className="header">
              <Col md={3} sm={3} xs={3}>NAME</Col>
              <Col md={3} sm={3} xs={3}>EMAIL</Col>
              <Col md={2} sm={2} xs={2}>PHONE</Col>
              <Col md={2} sm={2} xs={2}>STAGE</Col>
              <Col md={2} sm={2} xs={2}>SOURCE</Col>
            </Row>
            {
              _.chain(contacts)
              .map(contact => (
                <Row
                  key={`CONTACT_${contact.id}`}
                  onClick={() => browserHistory.push(`/dashboard/contacts/${contact.id}`)}
                  className="item"
                >
                  <Col md={3} sm={3} xs={3} className="vcenter">
                    <Avatar
                      className="avatar"
                      round
                      name={this.getDisplayName(contact)}
                      src={this.getAvatar(contact)}
                      size={35}
                    />
                    <span style={{ marginLeft: '10px' }}>{ this.getDisplayName(contact) }</span>
                  </Col>
                  <Col md={3} sm={3} xs={3} className="vcenter">
                    { this.getEmail(contact) }
                  </Col>
                  <Col md={2} sm={2} xs={2} className="vcenter">
                    { this.getPhoneNumber(contact) }
                  </Col>
                  <Col md={2} sm={2} xs={2} className="vcenter">
                    { this.getStage(contact) }
                  </Col>
                  <Col md={2} sm={2} xs={2} className="vcenter">
                    { this.getSourceType(contact) }
                  </Col>
                </Row>
              ))
              .value()
            }
          </Grid>
        }
      </div>
    )
  }
}
