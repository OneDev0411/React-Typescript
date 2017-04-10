import React from 'react'
import { Grid, Row, Col, Button } from 'react-bootstrap'
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

  addContact() {

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
            >
              Add Contact
            </Button>
          </Col>
        </Row>

        {
          contacts.length > 0 &&
          <Grid className="table">
            <Row className="header">
              <Col md={3} sm={3} xs={3}>Name</Col>
              <Col md={3} sm={3} xs={3}>Email</Col>
              <Col md={2} sm={2} xs={2}>Phone</Col>
              <Col md={2} sm={2} xs={2}>Stage</Col>
              <Col md={2} sm={2} xs={2}>Source</Col>
            </Row>
            {
              _.chain(contacts)
              .map(contact => (
                <Row
                  key={`CONTACT_${contact.id}`}
                  onClick={() => browserHistory.push(`/dashboard/contacts/${contact.id}`)}
                  className="contact"
                >
                  <Col md={3} sm={3} xs={3}>
                    -
                  </Col>
                  <Col md={3} sm={3} xs={3}>--</Col>
                  <Col md={2} sm={2} xs={2}>--</Col>
                  <Col md={2} sm={2} xs={2}>--</Col>
                  <Col md={2} sm={2} xs={2}>--</Col>
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
