import React from 'react'
import { Grid, Row, Col } from 'react-bootstrap'
import { browserHistory } from 'react-router'
import Avatar from 'react-avatar'
import _ from 'underscore'
import Contact from '../../../../../models/Contact'
import { upsertAttributes } from '../../../../../store_actions/contact'
import AddContact from '../Add-Contact'
import Stage from '../components/Stage'

export default class ContactsList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      contacts: {}
    }
  }

  componentDidMount() {
    const { contacts } = this.props

    if (contacts)
      this.setState({ contacts })
  }

  componentWillReceiveProps(nextProps) {
    const { contacts } = nextProps

    if (contacts && _.size(contacts) > _.size(this.state.contacts))
      this.setState({ contacts })
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { contacts } = nextProps
    return (contacts && _.size(contacts) > _.size(this.state.contacts))
  }

  onNewContact(id) {
    this.open(id)
  }

  onChangeStage(stage, contact) {
    const { user, dispatch } = this.props

     const attributes = [{
      id: Contact.get.stage(contact).id,
      type: 'stage',
      stage
    }]

    dispatch(upsertAttributes(user, contact.id, 'stage', attributes))
  }

  open (id) {
    browserHistory.push(`/dashboard/contacts/${id}`)
  }

  render() {
    const { contacts } = this.state

    return (
      <div className="list">

        {
          _.size(contacts) > 0 &&
          <Row className="toolbar">
            <Col lg={6} md={6} sm={6} className="vcenter">
              <span className="title">All Contacts</span>

              <span className="count">
                { _.size(contacts) } Contacts
              </span>
            </Col>

            <Col lg={6} md={6} sm={6} className="vcenter right">

              <AddContact
                user={this.props.user}
                onNewContact={(id) => this.onNewContact(id)}
              />

            </Col>
          </Row>
        }

        {
          _.size(contacts) === 0 &&
          <div className="no-contacts">
            <p className="title">You don't have contacts yet</p>
            <p>To get started, click the blue button to add contact</p>
            <AddContact
              user={this.props.user}
              onNewContact={(id) => this.onNewContact(id)}
            />
          </div>
        }
        {
          _.size(contacts) > 0 &&
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
                  className="item"
                >
                  <Col
                    md={3}
                    sm={3}
                    xs={3}
                    className="vcenter"
                    onClick={() => this.open(contact.id) }
                  >
                    <Avatar
                      className="avatar"
                      round
                      name={Contact.get.name(contact)}
                      src={Contact.get.avatar(contact)}
                      size={35}
                    />
                    <span style={{ marginLeft: '10px' }}>
                      { Contact.get.name(contact, 20) }
                    </span>
                  </Col>
                  <Col
                    md={3}
                    sm={3}
                    xs={3}
                    className="vcenter"
                    style={{ overflow: 'hidden' }}
                    onClick={() => this.open(contact.id) }
                  >
                    { Contact.get.email(contact, 30) }
                  </Col>
                  <Col
                    md={2}
                    sm={2}
                    xs={2}
                    className="vcenter"
                    onClick={() => this.open(contact.id) }
                  >
                    { Contact.get.phone(contact) }
                  </Col>
                  <Col
                    md={2}
                    sm={2}
                    xs={2}
                    className="vcenter"
                  >
                    <Stage
                      default={Contact.get.stage(contact).name}
                      onChange={stage => this.onChangeStage(stage, contact)}
                    />
                  </Col>
                  <Col
                    md={2}
                    sm={2}
                    xs={2}
                    className="vcenter"
                    onClick={() => this.open(contact.id) }
                  >
                    { Contact.get.source(contact).label }
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
