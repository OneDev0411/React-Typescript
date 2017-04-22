import React from 'react'
import {
  Row,
  Col,
  Tabs,
  Tab,
  Button,
  Overlay,
  Tooltip,
  Popover
} from 'react-bootstrap'
import { browserHistory } from 'react-router'
import { Link } from 'react-router'
import S from 'shorti'
import _ from 'underscore'
import Avatar from 'react-avatar'
import AppStore from '../../../../../stores/AppStore'
import DealDispatcher from '../../../../../dispatcher/DealDispatcher'
import DealForms from '../Forms'
import DealESigns from '../ESigns'
import Uploads from '../Uploads'

export default class DealDashboard extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      id: props.params.id,
      deal: null,
      activeTab: props.params.tab || 'forms',
      submissions: null,
      envelopes: null,
      files: null
    }
  }

  componentDidMount() {
    const { deals, params } = this.props
    const { activeTab } = this.state

    // get deal
    const deal = deals.list[params.id]

    if (!deal)
      return

    this.setState({ deal })

    // load data based on active tab
    this.onTabChange(activeTab)
  }

  componentWillReceiveProps(nextProps) {
    const { deals, params } = nextProps
    const { submissions, envelopes, files } = this.state

    // load deal
    const deal = deals.list[params.id]

    if (!deal)
      return

    if (!this.state.deal)
      this.setState({ deal })

    if (!submissions)
      this.setState({ submissions: deal.submissions })

    if (!envelopes)
      this.setState({ envelopes: deal.envelopes })

    if (!files) {
      this.setState({ files: deal.files })
    }

    if (deal.files && files && deal.files.length > files.length)
      this.setState({ files: deal.files })
  }

  shouldComponentUpdate(nextProps, nextState) {
    return typeof nextProps.deals !== 'undefined'
  }

  getCoverImage(deal) {
    let src = '/static/images/deals/home.svg'

    if (deal.listing)
      src = deal.listing.cover_image_url

    return <img style={S('mr-10 w-40 br-2')} src={src} />
  }

  getNumberWithCommas(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }

  onTabChange(id) {
    this.setState({
      activeTab: id
    })

    switch (id) {
      case 'forms':
        this.getSubmissions()
        break

      case 'esigns':
        this.getEnvelopes()
        break

      case 'uploads':
        break
    }
  }

  getSubmissions() {
    DealDispatcher.dispatch({
      action: 'get-submissions',
      user: this.props.user,
      id: this.props.params.id
    })
  }

  getEnvelopes() {
    DealDispatcher.dispatch({
      action: 'get-envelopes',
      user: this.props.user,
      id: this.props.params.id
    })
  }

  getAddress(deal) {
    const address = this.getValue(deal, 'street_address')

    if (address.endsWith(','))
      return address.substring(0, address.length - 1)
    return address
  }

  getFullAddress(deal) {
    const city = this.getValue(deal, 'city')
    const state = this.getValue(deal, 'state')
    const postal_code = this.getValue(deal, 'postal_code')
    return `${city}, ${state}, ${postal_code}`.replace(/-,/ig, '')
  }

  getPrice(deal) {
    const price = this.getValue(deal, 'list_price')

    if (price === '-')
      return price

    return `$${this.getNumberWithCommas(price)}`
  }

  getStatus(deal) {
    if (deal.listing)
      return deal.listing.status

    return '-'
  }

  getValue(deal, field) {
    if (deal.context && deal.context[field])
      return deal.context[field]
    else if (deal.proposed_values && deal.proposed_values[field])
      return deal.proposed_values[field]

    return '-'
  }

  goBack() {
    browserHistory.push('/dashboard/deals')
  }

  collectSignatures() {
    if (AppStore.data.deals_signatures) {
      AppStore.data.deals_signatures.documents = {}
      AppStore.emitChange()
    }

    browserHistory.push(`/dashboard/deals/${this.state.id}/collect-signatures/documents`)
  }

  render() {
    const { deal, submissions, envelopes, files, activeTab } = this.state

    if (deal === null)
      return false

    return (
      <div className="dashboard">

        <Row className="header">
          <Col lg={5} md={5} sm={5}>
            <h4>
              <i className="fa fa-angle-left" onClick={() => this.goBack()} />
              { this.getAddress(deal) }
            </h4>
          </Col>

          <Col lg={7} md={7} sm={7}>
            <ul className="menu">
              {
                submissions &&
                <li
                  onClick={this.collectSignatures.bind(this)}
                >
                  <img src="/static/images/deals/pen.svg" />
                </li>
              }
            </ul>
          </Col>
        </Row>

        <Row className="content">

          <Col lg={3} md={3} sm={3}>

            <div className="sidebar">
              <Row>
                <Col xs={8}>
                  <div className="street">{ this.getAddress(deal) }</div>
                  <div className="address">{ this.getFullAddress(deal) }</div>
                </Col>

                <Col xs={4}>
                  { this.getCoverImage(deal) }
                </Col>
              </Row>

              <div className="hr" />

              <div className="item">
                Status: <span>{ this.getStatus(deal) }</span>
              </div>

              <div className="item">
                Price: <span>{ this.getPrice(deal) }</span>
              </div>

              <div className="hr" />

              {
                deal.roles && deal.roles.map(role => (
                  <Row
                    key={`ROLE_${role.id}`}
                    style={S('mb-15')}
                  >
                    <Col xs={8}>
                      <div>{ role.user.display_name }</div>
                      <div style={{ color: 'gray' }}>{ role.role }</div>
                    </Col>

                    <Col xs={4}>
                      <Avatar
                        round
                        name={role.user.display_name}
                        src={role.user.profile_image_url}
                        size={35}
                      />
                    </Col>
                  </Row>
                  ))
              }

            </div>
          </Col>

          <Col lg={9} md={9} sm={9}>
            <div className="main">
              <Tabs
                defaultActiveKey={activeTab}
                animation={false}
                id="deals-dashboard"
                onSelect={this.onTabChange.bind(this)}
              >
                <Tab eventKey="forms" title="Forms" className="forms">
                  <DealForms
                    submissions={submissions}
                    user={this.props.user}
                    forms={this.props.deals.forms}
                    deal_id={this.props.params.id}
                    activeTab={activeTab}
                  />
                </Tab>

                <Tab eventKey="esigns" title="eSigns" className="eSigns">
                  <DealESigns
                    envelopes={envelopes}
                    user={this.props.user}
                    activeTab={activeTab}
                  />
                </Tab>

                <Tab eventKey="uploads" title="Uploads" className="uploads">
                  <Uploads
                    files={files}
                    user={this.props.user}
                    deal={deal}
                    deal_id={this.props.params.id}
                    activeTab={activeTab}
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
