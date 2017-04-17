import React from 'react'
import { browserHistory } from 'react-router'
import { Row, Col, Button, Tabs, Tab } from 'react-bootstrap'
import Avatar from 'react-avatar'
import moment from 'moment'
import Dispatcher from '../../../../../dispatcher/ContactDispatcher'
import Stepper from '../../../../Partials/Stepper'
import Contact from '../../../../../models/Contact'
import AddNote from './Add-Note'
import Timeline from './Timeline'

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
    return list.indexOf(stage)
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
                onChange={ () => {}}
              />
            </div>

            <div className="card details">
              <div className="title">Details</div>
              <ul className="table">
                {
                  Contact.get.emails(contact).map(item => (
                    <li key={`email_${item.id}`}>
                      <span className="name">Email</span>{ item.email }
                    </li>
                  ))
                }

                {
                  Contact.get.phones(contact).map(item => (
                    <li key={`phone_${item.id}`}>
                      <span className="name">Phone</span>{ item.phone_number }
                    </li>
                  ))
                }
                <li><span className="name">Original Source</span>{ Contact.get.source(contact) }</li>
                {
                  Contact.get.birthdays(contact).map((birthday, key) => (
                    <li key={`birthday_${key}`}>
                      <span className="name">Birthday</span>{ birthday }
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
                    <li><span className="name">Address</span>{ address.street_name || '-' }</li>
                    <li><span className="name">City</span>{ address.city || '-' }</li>
                    <li><span className="name">State/region</span>{ address.state || '-' }</li>
                    <li><span className="name">Zipcode</span>{ address.postal_code || '-' }</li>
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
