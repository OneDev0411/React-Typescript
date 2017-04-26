import React from 'react'
import {
  Row,
  Col,
  Tabs,
  Tab,
  Popover,
  OverlayTrigger
} from 'react-bootstrap'
import { browserHistory } from 'react-router'
import S from 'shorti'
import _ from 'underscore'
import Avatar from 'react-avatar'
import AppStore from '../../../../../stores/AppStore'
import DealDispatcher from '../../../../../dispatcher/DealDispatcher'
import ConciergeDispatcher from '../../../../../dispatcher/ConciergeDispatcher'
import DealForms from '../Forms'
import DealESigns from '../ESigns'
import Uploads from '../Uploads'
import FilePreviewModal from './file-preview-modal'
import SubmitReviewModal from './submit-review-modal'
import MessageModal from '../../../../Partials/MessageModal'


const serializeFormToObject = (form) => {
  let obj = {}
  let checkedCheckboxs = []
  const files = form.elements.file
  const envelopes = form.elements.envelope_document

  if (envelopes) {
    if (Array.isArray(envelopes)) {
      checkedCheckboxs = [
        ...checkedCheckboxs,
        ...form.elements.envelopes
      ]
    } else checkedCheckboxs.push(envelopes)
  }

  if (files) {
    if (Array.isArray(files)) {
      checkedCheckboxs = [
        ...checkedCheckboxs,
        ...form.elements.files
      ]
    } else checkedCheckboxs.push(files)
  }

  checkedCheckboxs = checkedCheckboxs.filter(
    element => element.type === 'checkbox' && element.checked
  )

  return checkedCheckboxs.map((checkbox) => {
    let obj = {}
    obj[checkbox.name] = checkbox.id
    obj.state = 'Pending'
    return obj
  })
}

export default class DealDashboard extends React.Component {

  constructor(props) {
    super(props)
    this.reviews = {}
    const { id } = props.params
    this.deal = props.deals.list[id] || null
    if (this.deal.reviews) {
      this.fillreviews()
      if (this.deal.files) this.mapReviewsToFiles()
    }

    this.state = {
      activeTab: props.params.tab || 'forms',
      submissions: null,
      envelopes: null,
      showSuccessModal: false,
      allReviewableDocs: null,
      files: this.deal.files || null,
      reviewRequestModalIsActive: false,
      reviewRequestModalIsFreezed: false,
      filePreviewModalContent: '',
      filePreviewModalIsActive: false
    }

    this.reviewRequestModalCloseHandler =
      this.reviewRequestModalCloseHandler.bind(this)
    this.reviewRequestModalShowHandler =
      this.reviewRequestModalShowHandler.bind(this)
    this.reviewRequestModalSubmitHandler =
      this.reviewRequestModalSubmitHandler.bind(this)
    this.filePreviewModalCloseHandler =
      this.filePreviewModalCloseHandler.bind(this)
    this.filePreviewModalShowHandler =
      this.filePreviewModalShowHandler.bind(this)
  }

  componentDidMount() {
    const { activeTab } = this.state
    if (!this.deal) return

    // load data based on active tab
    this.onTabChange(activeTab)
  }

  componentWillReceiveProps(nextProps) {
    const { id } = nextProps.params
    const { deals } = nextProps
    const { submissions, envelopes, files } = this.state

    // load deal
    const deal = deals.list[id]
    if (!deal) return

    if (!files && deal.files)
      this.setState({ files: deal.files })

    if (!envelopes && deal.envelopes) {
      const envelopes = this.mapReviewsToDocuments(deal.envelopes)
      this.setState({ envelopes })
    }

    if (!submissions && deal.submissions)
      this.setState({ submissions: deal.submissions })

    if (deal.files && files && deal.files.length > files.length)
      this.setState({ files: deal.files })
  }

  shouldComponentUpdate(nextProps, nextState) {
    return typeof nextProps.deals !== 'undefined'
  }

  fillreviews() {
    const reviews = this.deal.reviews
    if (reviews) {
      this.deal.reviews.forEach((review) => {
        const id = review.file || review.envelope_document
        this.reviews[id] = {
          ...review
        }
      })
    }
  }

  mapReviewsToFiles() {
    const newFiles = this.deal.files.map((file) => {
      const review = this.reviews[file.id] || null
      return {
        ...file,
        review
      }
    })
    this.deal.files = newFiles
    AppStore.data.deals.list[this.deal.id] = this.deal
  }

  mapReviewsToDocuments(envelopes) {
    return envelopes.map((envelope) => {
      if (!envelope.documents)
        return envelope

      const documents = envelope.documents.map((doc) => {
        const review = (this.reviews && this.reviews[doc.id]) || null
        return {
          ...doc,
          review
        }
      })
      return {
        ...envelope,
        documents
      }
    })
  }

  getSubmissions() {
    if (this.state.submissions)
      return

    DealDispatcher.dispatch({
      action: 'get-submissions',
      user: this.props.user,
      id: this.props.params.id
    })
  }

  getEnvelopes() {
    if (this.state.envelopes)
      return

    DealDispatcher.dispatch({
      action: 'get-envelopes',
      user: this.props.user,
      id: this.props.params.id
    })
  }

  filePreviewModalCloseHandler() {
    this.setState({
      filePreviewModalIsActive: false
    })
  }

  filePreviewModalShowHandler(file) {
    this.setState({
      filePreviewModalIsActive: true,
      filePreviewModalContent: file
    })
  }

  reviewRequestModalCloseHandler() {
    if (!this.state.reviewRequestModalIsFreezed) {
      // browserHistory.push(`/dashboard/deals/${this.props.params.id}`)
      this.setState({
        reviewRequestModalIsActive: false
      })
    }
  }
  reviewRequestModalShowHandler() {
    // browserHistory.push(`/dashboard/deals/${this.props.params.id}/reviews`)
    this.setState({
      reviewRequestModalIsActive: true
    })
  }

  async reviewRequestSubmit(docs) {
    const token = this.props.user.access_token
    const { id } = this.props.params
    const body = {
      reviews: docs
    }
    const action = {
      id,
      body,
      token,
      type: 'SUBMIT_REVIEW_REQUEST'
    }
    const reviews = await ConciergeDispatcher.dispatchSync(action)
    reviews.forEach((review) => {
      const type = review.file ? 'FILE' : 'ENVELOPE'
      switch (type) {
        case 'FILE':
          if (this.state.files) {
            const files = this.state.files.map((file) => {
              if (file.id !== review.file) return file

              file.review = review
              return file
            })
            this.setState({ files })
          }
          break
        case 'ENVELOPE':
          if (this.state.envelopes) {
            const envelopes = this.state.envelopes.map((envelope) => {
              if (!envelope.documents) return envelope

              const documents = envelope.documents.map((document) => {
                document.review = review
                return document
              })
              return {
                ...envelope,
                documents
              }
            })
            this.setState({ envelopes })
          }
          break
      }
    })
    this.setState({
      showSuccessModal: true,
      reviewRequestModalIsActive: false,
      reviewRequestModalIsFreezed: false
    })
    setTimeout(() => {
      this.setState({
        showSuccessModal: false
      })
    }, 1500)
  }

  reviewRequestModalSubmitHandler(form) {
    this.setState({
      reviewRequestModalIsFreezed: true
    })
    const docs = serializeFormToObject(form)
    this.reviewRequestSubmit(docs)
  }

  preparedEnvelopes(envelopes) {
    let list = []
    envelopes.map((envelope) => {
      if (!envelope.documents)
        return

      envelope.documents.forEach((document, index) => {
        document = {
          ...document,
          index
        }
        list.push(document)
      })
    })
    return list
  }

  getAllReviewableDocs(envelopes, files) {
    let allReviewableDocs = []
    if (envelopes) {
      allReviewableDocs = [
        ...this.preparedEnvelopes(envelopes)
      ]
    }
    if (files) {
      allReviewableDocs = [
        ...allReviewableDocs,
        ...files
      ]
    }
    return allReviewableDocs
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
    this.setState({ activeTab: id })

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

    browserHistory.push(`/dashboard/deals/${this.props.params.id}/collect-signatures/documents`)
  }

  render() {
    const popover = {
      submitReview: <Popover className="c-popover c-popover--bottom" id="popover-submitReview">Submit for broker review</Popover>,
      collectSignatures: <Popover className="c-popover c-popover--bottom" id="popover-collectSignatures">Collect Signatures</Popover>
    }
    const deal = this.deal
    const { submissions, envelopes, files, activeTab } = this.state
    const allReviewableDocs = this.getAllReviewableDocs(envelopes, files)

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
                <OverlayTrigger placement="bottom" overlay={popover.collectSignatures} delayShow={200} delayHide={0}>
                  <li
                    onClick={this.collectSignatures.bind(this)}
                  >
                    <img src="/static/images/deals/pen.svg" />
                  </li>
                </OverlayTrigger>
              }
              <OverlayTrigger placement="bottom" overlay={popover.submitReview} delayShow={200} delayHide={0}>
                <li
                  onClick={this.reviewRequestModalShowHandler}
                >
                  <img src="/static/images/deals/glasses-round.svg" />
                </li>
              </OverlayTrigger>
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

        <SubmitReviewModal
          documents={allReviewableDocs}
          token={this.props.user.access_token}
          isActive={this.state.reviewRequestModalIsActive}
          isFreezed={this.state.reviewRequestModalIsFreezed}
          closeHandler={this.reviewRequestModalCloseHandler}
          submitHandler={this.reviewRequestModalSubmitHandler}
          filePreviewModalShowHandler={this.filePreviewModalShowHandler}
        />

        <FilePreviewModal
          file={this.state.filePreviewModalContent}
          isActive={this.state.filePreviewModalIsActive}
          onCloseHandler={this.filePreviewModalCloseHandler}
        />

        <MessageModal
          show={this.state.showSuccessModal}
          text="Documents submitted for review!"
        />
      </div>
    )
  }
}
