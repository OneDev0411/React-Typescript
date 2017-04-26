import React from 'react'
import { browserHistory } from 'react-router'
import { Row, Col, Button, Tabs, Tab } from 'react-bootstrap'
import Avatar from 'react-avatar'
import moment from 'moment'
import AppStore from '../../../../../stores/AppStore'
import Dispatcher from '../../../../../dispatcher/ContactDispatcher'
import Stepper from '../../../../Partials/Stepper'
import Contact from '../../../../../models/Contact'
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
    const { contacts, params } = this.props
    const contact = contacts[params.id]

    if (!contact)
      return

    this.setState({ contact })

    if (!contact.timeline)
      this.getTimeline()
  }

  componentWillReceiveProps(nextProps) {
    const { contacts, params } = nextProps

    // load deal
    const contact = contacts[params.id]

    if (!contact)
      return

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

  changeStage(stage, contact) {
    const { user, params } = this.props

    const attributes = [{
      id: Contact.get.stage(contact).id,
      type: stage,
      stage: stage.replace(/\s/g, '')
    }]

    Dispatcher.dispatch({
      action: 'upsert-attributes',
      id: params.id,
      type: 'stage',
      attributes,
      user
    })
  }

  onAddAttribute(type) {
    const { contact } = this.state
    const attributes = contact.sub_contacts[0].attributes
    const entity = `${type}s`
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

    return (
      <div className="dashboard">

        <Row className="header">
          <Col lg={11} md={11} sm={11}>
            <h4>
              <i className="fa fa-angle-left" onClick={() => this.goBack()} />
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
                  Contact.get.emails(contact).map((item, key) => (
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
                  Contact.get.phones(contact).map((item, key) => (
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
                <li>
                  <div className="name">Original Source</div>
                  <div className="data">
                    { Contact.get.source(contact) || '-' }
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
                      <div className="data">{ address.street_name || '-' }</div>
                    </li>
                    <li>
                      <div className="name">City</div>
                      <div className="data">{ address.city || '-' }</div>
                    </li>
                    <li>
                      <div className="name">State/region</div>
                      <div className="data">{ address.state || '-' }</div>
                    </li>
                    <li>
                      <div className="name">Zipcode</div>
                      <div className="data">{ address.postal_code || '-' }</div>
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
                  {
                    Contact.get.notes(contact).map(item => (
                      <div key={`note_${item.id}`} className="item">
                        {
                          item.note.split('\n').map((text, key) => (
                            <div key={`item_${item.id}_line_${key}`}>
                              {text}
                            </div>
                          ))
                        }
                        <span className="time">
                          { moment.unix(item.created_at ).format('MMMM DD, YYYY')}
                        </span>
                      </div>
                    ))
                  }
                </Tab>
              </Tabs>
            </div>
          </Col>
        </Row>
      </div>
    )
  }
}
