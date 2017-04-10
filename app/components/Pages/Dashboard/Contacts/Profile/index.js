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
              <span className="title">Stage:</span>
              <Stepper
                steps={['General', 'Unqualified Lead', 'Qualified Lead', 'Active', 'Past Client']}
                active="General"
                onChange={ () => {}}
              />
            </div>

          </Col>

          <Col lg={8} md={8} sm={8}>
          </Col>
        </Row>
      </div>
    )
  }
}
