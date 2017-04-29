import S from 'shorti'
import React from 'react'
import _ from 'underscore'
import Avatar from 'react-avatar'
import { browserHistory } from 'react-router'
import { Row, Col, Tabs, Tab } from 'react-bootstrap'
import AppStore from '../../../../../stores/AppStore'
import { getFieldValue } from '../../../../../utils/helpers'
import DealDispatcher from '../../../../../dispatcher/DealDispatcher'
import Menu from './Views/Menu'
import DealDetail from './Views/DealDetail'
import DealForms from '../Forms'
import DealESigns from '../ESigns'
import Uploads from '../Uploads'
import Review from '../Review'

export default class DealDashboard extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      deal: null,
      showReviewModal: false,
      activeTab: props.params.tab || 'forms'
    }
  }

  componentDidMount() {
    this.onTabChange(this.state.activeTab)
    this.setDeal()
  }

  shouldComponentUpdate(nextProps, nextState) {
    return typeof nextProps.deals !== 'undefined'
  }

  async setDeal() {
    const { deals, params } = this.props
    const deal = deals.list[params.id]

    if (!deal)
      return this.goBack()

    // update deal
    this.setState({ deal })

    if (!deal.submissions) {
      deal.submissions = await this.get('submissions')
      this.setState({ deal })
    }

    if (!deal.envelopes) {
      deal.envelopes = await this.get('envelopes')
      this.setState({ deal })
    }
  }

  async get(item) {
    return await DealDispatcher.dispatchSync({
      action: `get-${item}`,
      user: this.props.user,
      id: this.props.params.id
    })
  }

  collectSignatures() {
    // if (AppStore.data.deals.signatures) {
    //   AppStore.data.deals.signatures.documents = {}
    //   AppStore.emitChange()
    // }

    browserHistory.push(`/dashboard/deals/${this.props.params.id}/collect-signatures/documents`)
  }

  onTabChange(id) {
    this.setState({ activeTab: id })
  }

  goBack() {
    browserHistory.push('/dashboard/deals')
  }

  render() {
    const {
      deal,
      activeTab
    } = this.state


    if (!deal) {
      return (
        <div className="loading-list">
          <div><i className="fa fa-spinner fa-spin fa-2x fa-fw" /></div>
          <b>Loading deals ...</b>
        </div>
      )
    }

    return (
      <div className="dashboard">

        <Row className="header">
          <Col lg={5} md={5} sm={5}>
            <h4>
              <i
                className="fa fa-angle-left"
                onClick={() => this.goBack()}
              />
              { getFieldValue(deal, 'street_address') || '-' }
            </h4>
          </Col>

          <Col lg={7} md={7} sm={7}>
            <Menu
              submissions={deal.submissions}
              onCollectSignatures={
                () => this.collectSignatures()
              }
              onReviewRequest={() => this.setState({ showReviewModal: true })}
            />
          </Col>
        </Row>

        <Row className="content">

          <Col lg={3} md={3} sm={3}>
            <DealDetail deal={deal} />
          </Col>

          <Col lg={9} md={9} sm={9}>
            <div className="main">
              <Tabs
                defaultActiveKey={activeTab}
                animation={false}
                id="deals-dashboard"
                onSelect={id => this.onTabChange(id)}
              >
                <Tab eventKey="forms" title="Forms" className="forms">
                  <DealForms
                    submissions={deal.submissions}
                    user={this.props.user}
                    forms={this.props.deals.forms}
                    deal_id={this.props.params.id}
                    activeTab={activeTab}
                  />
                </Tab>

                <Tab eventKey="esigns" title="eSigns" className="eSigns">
                  <DealESigns
                    envelopes={deal.envelopes}
                    user={this.props.user}
                    activeTab={activeTab}
                  />
                </Tab>

                <Tab eventKey="uploads" title="Uploads" className="uploads">
                  <Uploads
                    files={deal.files}
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

        <Review
          deal={deal}
          user={this.props.user}
          onClose={() => this.setState({ showReviewModal: false })}
          show={this.state.showReviewModal}
          onChange={deal => this.setState({ deal })}
        />
      </div>
    )
  }
}
