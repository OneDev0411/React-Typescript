import React from 'react'
import { Row, Col, Button } from 'react-bootstrap'
import Avatar from 'react-avatar'
import Stepper from '../../../../Partials/Stepper'

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

  }

  render() {
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
                name={'M M'}
                src={''}
                size={90}
              />

              <span className="email">mary_cain@gmail.com</span>
            </div>

            <div className="card stage">
              <div className="title">Stage:</div>
              <Stepper
                steps={['General', 'Unqualified Lead', 'Qualified Lead', 'Active', 'Past Client']}
                active="General"
                onChange={ () => {}}
              />
            </div>

            <div className="card details">
              <div className="title">Details</div>
              <ul className="table">
                <li><span className="name">Email</span>mary_cain@gmail.com</li>
                <li><span className="name">Original Source</span>Clay Stapp+Co</li>
              </ul>
            </div>

            <div className="card address">
              <div className="title">Address</div>
              <ul className="table">
                <li><span className="name">Address</span>4422 Margret Pine</li>
                <li><span className="name">City</span>-</li>
                <li><span className="name">State/region</span>-</li>
                <li><span className="name">Zipcode</span>-</li>
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
