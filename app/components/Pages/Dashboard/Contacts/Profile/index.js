import React from 'react'
import { browserHistory } from 'react-router'
import { Row, Col, Button } from 'react-bootstrap'
import Avatar from 'react-avatar'
import Stepper from '../../../../Partials/Stepper'
import Contact from '../../../../../models/Contact'

export default class ContactProfile extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      contact: null
    }
  }

  componentDidMount() {
    const { contacts, params } = this.props
    const contact = contacts[params.id]

    if (!contact)
      return

    this.setState({ contact })
  }

  componentWillReceiveProps(nextProps) {
    const { contacts, params } = nextProps

    if (this.state.contact)
      return

    // load deal
    const contact = contacts[params.id]

    if (!contact)
      return

    this.setState({ contact })
  }

  shouldComponentUpdate(nextProps, nextState) {
    return typeof nextProps.contacts !== 'undefined'
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
    const { contact } = this.state

    if (!contact)
      return false

    // get address
    const address = Contact.get.address(contact)

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
                <li><span className="name">Birthday</span>{ Contact.get.birthday(contact) }</li>
              </ul>
            </div>

            <div className="card address">
              <div className="title">Address</div>
              <ul className="table">
                <li><span className="name">Address</span>{ address.street_name || '-' }</li>
                <li><span className="name">City</span>{ address.city || '-' }</li>
                <li><span className="name">State/region</span>{ address.state || '-' }</li>
                <li><span className="name">Zipcode</span>{ address.postal_code || '-' }</li>
              </ul>
            </div>

          </Col>

          <Col lg={7} md={7} sm={7}>

            <div className="note">
              <div className="head">
                <img src="/static/images/contacts/notepad.svg" />
                New Note
              </div>
              <textarea
                placeholder="What do you want to say?"
              ></textarea>
              <div className="footer">
                <Button bsStyle="danger" disabled={true}>Enter</Button>
              </div>
            </div>

            <div className="card activity">
              <div className="head">
                <ul>
                  <li className="active">All Activities</li>
                  <li>Notes</li>
                </ul>
              </div>
              <div className="content">
                <div className="blank">
                  <img src="/static/images/contacts/activity.svg" />
                  Mary has no activity right now
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    )
  }
}
