import React from 'react'
import { browserHistory } from 'react-router'
import { Row, Col, Button, Tabs, Tab } from 'react-bootstrap'
import Avatar from 'react-avatar'
import moment from 'moment'
import AppStore from '../../../../../stores/AppStore'
import Dispatcher from '../../../../../dispatcher/ContactDispatcher'
import Stepper from '../../../../Partials/Stepper'
import Contact from '../../../../../models/Contact'
import Notes from './Notes'
import AddNote from './Add-Note'
import Timeline from './Timeline'
import Tags from './Tags'
import Editable from './Editable'

export default class ContactProfile extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      contact: null,
      activeTab: 'timeline'
    }
  }

  componentDidMount() {
    const { contacts, tags, params } = this.props
    const contact = contacts[params.id]

    if (!contact)
      return

    // set default tags
    contact.default_tags = tags

    // set state
    this.setState({
      contact
    })

    if (!contacts[params.id].timeline)
      this.getTimeline()
  }

  componentWillReceiveProps(nextProps) {
    const { contacts, tags, params } = nextProps

    // load deal
    const contact = contacts[params.id]

    if (!contact)
      return

    // set default tags
    contact.default_tags = tags

    this.setState({ contact })
  }

  shouldComponentUpdate(nextProps, nextState) {
    return typeof nextProps.contacts !== 'undefined'
  }

  async getTimeline() {
    const { user, params } = this.props

    const timeline = await Dispatcher.dispatchSync({
      action: 'get-timeline',
      id: params.id,
      user
    })

    const contact = {
      ...this.state.contact,
      ...timeline
    }

    this.setState({ contact })
  }

  goBack() {
    browserHistory.push('/dashboard/contacts')
  }

  getStageIndex(contact) {
    const list = ['General', 'UnqualifiedLead', 'QualifiedLead', 'Active', 'PastClient']
    const stage = Contact.get.stage(contact)
    return list.indexOf(stage.name)
  }

  onAddAttribute(type) {
    const { contact } = this.state
    const attributes = contact.sub_contacts[0].attributes
    const entity = `${type}s`

    if (!attributes[entity])
      attributes[entity] = new Array()

    attributes[entity].push({
      type,
      [type]: `Enter ${type} #${attributes[entity].length + 1}`
    })
    this.setState({ contact })
  }

  onChangeAttribute(type, id, text) {
    const { user, params } = this.props
    const attributes = [{
      id,
      type,
      [type]: text
    }]

    this.upsertAttributes(type, attributes)
  }

  changeStage(stage, contact) {
    const { user, params } = this.props

    const attributes = [{
      id: Contact.get.stage(contact).id,
      type: 'stage',
      stage: stage.replace(/\s/g, '')
    }]

    this.upsertAttributes('stage', attributes)
  }

  onChangeAddress(address, field, type, id, text) {
    const { user, params } = this.props

    const attributes = [{
      id,
      type: 'address',
      street_name: address.street_name,
      city: address.city,
      state: address.state,
      postal_code: address.postal_code
    }]

    // set field
    attributes[0][field] = text

    this.upsertAttributes('address', attributes)
  }

  upsertAttributes(type, attributes) {
    const { user, params } = this.props

    Dispatcher.dispatch({
      action: 'upsert-attributes',
      id: params.id,
      type,
      attributes,
      user
    })
  }

  render() {
    const { contact, activeTab } = this.state

    if (!contact)
      return false

    const notes = Contact.get.notes(contact)
    const emails = Contact.get.emails(contact)
    const phones = Contact.get.phones(contact)

    return (
      <div className="dashboard">

        <Row className="header">
          <Col lg={11} md={11} sm={11}>
            <h4 onClick={() => this.goBack()} style={{ cursor: 'pointer' }}>
              <i className="fa fa-angle-left" />
              All Contacts
            </h4>
          </Col>
        </Row>

        <Row className="content">
          <Col lg={5} md={5} sm={5}>

            <div className="card contact-info">
              <Avatar
                className="avatar"
                round
                name={Contact.get.name(contact)}
                src={Contact.get.avatar(contact)}
                size={90}
              />

              <div className="email">
                { Contact.get.name(contact, 30)}
                <div style={{ fontSize: '15px', color: 'gray'}}>
                  { Contact.get.email(contact, 30)}
                </div>
              </div>
            </div>

            <div className="card stage">
              <div className="title">Stage:</div>
              <Stepper
                steps={['General', 'Unqualified Lead', 'Qualified Lead', 'Active', 'Past Client']}
                active={ this.getStageIndex(contact) }
                onChange={stage => this.changeStage(stage, contact)}
              />
            </div>

            <div className="card details">
              <div className="title">Details</div>

              <ul className="table">

                <li>
                  <div className="name">Tags</div>
                  <div className="data">
                    <Tags
                      contact_id={this.props.params.id}
                      user={this.props.user}
                      tags={Contact.get.tags(contact)}
                    />
                  </div>
                </li>

                {
                  emails.map((item, key) => (
                    <li key={`email_${key}`}>
                      <div className="name">Email</div>
                      <div className="data">
                        <Editable
                          type="email"
                          id={item.id}
                          showEdit={true}
                          showAdd={true}
                          text={item.email}
                          onAdd={this.onAddAttribute.bind(this)}
                          onChange={this.onChangeAttribute.bind(this)}
                        />
                      </div>
                    </li>
                  ))
                }

                {
                  emails.length === 0 &&
                  <li key={`email_${key}`}>
                    <div className="name">Email</div>
                    <div className="data">
                      <Editable
                        type="email"
                        id={null}
                        showEdit={true}
                        showAdd={true}
                        text=""
                        onAdd={this.onAddAttribute.bind(this)}
                        onChange={this.onChangeAttribute.bind(this)}
                      />
                    </div>
                  </li>
                }

                {
                  phones.map((item, key) => (
                    <li key={`phone_${key}`}>
                      <div className="name">Phone</div>
                      <div className="data">
                        <Editable
                          type="phone_number"
                          id={item.id}
                          showEdit={true}
                          showAdd={true}
                          text={item.phone_number}
                          onAdd={this.onAddAttribute.bind(this)}
                          onChange={this.onChangeAttribute.bind(this)}
                        />
                      </div>
                    </li>
                  ))
                }

                {
                  phones.length === 0 &&
                  <li>
                    <div className="name">Phone</div>
                    <div className="data">
                      <Editable
                        type="phone_number"
                        id={null}
                        showEdit={true}
                        showAdd={true}
                        text="-"
                        onAdd={this.onAddAttribute.bind(this)}
                        onChange={this.onChangeAttribute.bind(this)}
                      />
                    </div>
                  </li>
                }

                <li>
                  <div className="name">Original Source</div>
                  <div className="data">
                    { Contact.get.source(contact).label || '-' }
                  </div>
                </li>
                {
                  Contact.get.birthdays(contact).map((item, key) => (
                    <li key={`birthday_${key}`}>
                      <div className="name">Birthday</div>
                      <div className="data">
                        <Editable
                          type="birthday"
                          id={item.id}
                          placeholder="mm / dd / yyyy"
                          showEdit={true}
                          showAdd={false}
                          text={item.birthday}
                          onChange={this.onChangeAttribute.bind(this)}
                        />
                      </div>
                    </li>
                  ))
                }
              </ul>
            </div>

            <div className="card address">
              <div className="title">Address</div>
              {
                Contact.get.addresses(contact).map((address, key) => (
                  <ul key={`address_${key}`} className="table" style={{ marginBottom: '10px' }}>
                    <li>
                      <div className="name">Address</div>
                      <div className="data">
                        <Editable
                          type="address"
                          id={address.id}
                          showEdit={true}
                          text={address.street_name || '-'}
                          onChange={this.onChangeAddress.bind(this, address, 'street_name')}
                        />
                      </div>
                    </li>
                    <li>
                      <div className="name">City</div>
                      <div className="data">
                        <Editable
                          type="address"
                          id={address.id}
                          showEdit={true}
                          text={address.city || '-'}
                          onChange={this.onChangeAddress.bind(this, address, 'city')}
                        />
                      </div>
                    </li>
                    <li>
                      <div className="name">State/region</div>
                      <div className="data">
                        <Editable
                          type="address"
                          id={address.id}
                          showEdit={true}
                          text={address.state || '-'}
                          onChange={this.onChangeAddress.bind(this, address, 'state')}
                        />
                      </div>
                    </li>
                    <li>
                      <div className="name">Zipcode</div>
                      <div className="data">
                        <Editable
                          type="address"
                          id={address.id}
                          showEdit={true}
                          text={address.postal_code || '-'}
                          onChange={this.onChangeAddress.bind(this, address, 'postal_code')}
                        />
                      </div>
                    </li>
                  </ul>
                ))
              }
            </div>

          </Col>

          <Col lg={7} md={7} sm={7}>

            <AddNote
              user={this.props.user}
              contact_id={this.props.params.id}
              onSave={ () => this.setState({ activeTab: 'notes' }) }
            />

            <div className="card activity">
              <Tabs
                activeKey={activeTab}
                animation={false}
                id="tab-timeline"
                onSelect={activeTab => this.setState({ activeTab })}
              >
                <Tab eventKey="timeline" title="All Activity" className="timeline">
                  <Timeline
                    name={Contact.get.name(contact)}
                    avatar={Contact.get.avatar(contact)}
                    activities={contact.timeline || {}}
                  />
                </Tab>

                <Tab eventKey="notes" title="Notes" className="notes">
                  <Notes
                    notes={notes}
                    onNoteChange={this.onChangeAttribute.bind(this)}
                  />
                </Tab>
              </Tabs>
            </div>
          </Col>
        </Row>
      </div>
    )
  }
}
