
import S from 'shorti'
import React from 'react'
import Modal from './Modal'
import ListTitle from './ListTitle'
import FilesList from './FilesList'
import EnvelopesList from './EnvelopesList'
import SubmissionsList from './SubmissionsList'
import { browserHistory } from 'react-router'
import config from '../../../../../../config/public'
import { Grid, Row, Col, Button } from 'react-bootstrap'
import AppStore from '../../../../../stores/AppStore'
import ConciergeDispatcher from '../../../../../dispatcher/ConciergeDispatcher'

const API_URL = config.app.url

const getFieldValue = (deal, field) => {
  if (deal.context && deal.context[field])
    return deal.context[field]
  else if (deal.proposed_values && deal.proposed_values[field])
    return deal.proposed_values[field]

  return '-'
}

const getIds = items => items.map(item => item.id)


export default class DealReview extends React.Component {

  constructor(props) {
    super(props)

    this.deal = null
    this.deals = null
    this.reviews = {}

    this.state = {
      files: [],
      envelopes: [],
      submissions: [],
      envelopesLoading: true,
      submissionsLoading: true,
      modalType: '',
      modalTitle: '',
      modalFreezed: false,
      modalIsActive: false,
      selectedReviewId: null
    }

    this.approveHandler = this.approveHandler.bind(this)
    this.declineHandler = this.declineHandler.bind(this)
    this.modalCloseHandler = this.modalCloseHandler.bind(this)
    this.modalSubmitHandler = this.modalSubmitHandler.bind(this)
  }

  componentDidMount() {
    this.getDeal().then((deal) => {
      this.deal = deal
      this.deals = this.props.conciergeDeals
      this.fillreviews()

      if (deal.files) {
        const files = this.mapReviewsToFiles(deal.files)
        this.setState({ files })
        this.deal.files = files
        // this.deals[this.deal.index] = this.deal
        // AppStore.data.conciergeDeals = this.deals
        // AppStore.emitChange()
      }
      this.getAll()
    })
  }

  async getDeal() {
    const dealId = this.props.params.id
    const { deals } = this.props.conciergeDeals
    const deal = await deals.find((deal, index) => {
      if (deal.id === dealId) {
        deal.index = index
        return deal
      }
    })
    return deal
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

  mapReviewsToFiles(files) {
    return files.map((file) => {
      const review = this.reviews[file.id] || null
      return {
        ...file,
        review
      }
    })
  }

  mapReviewsToDocuments(envelopes) {
    return envelopes.map((envelope) => {
      const documents = envelope.documents.map((doc) => {
        const review = this.reviews[doc.id] || null
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

  async getAll() {
    const { user } = this.props
    const dealId = this.props.params.id
    const deals = this.props.conciergeDeals.deals

    let { submissions } = deals[this.deal.index]
    let { envelopes } = deals[this.deal.index]

    if (submissions) {
      this.setState({
        submissions,
        submissionsLoading: false
      })
    } else
      await this.getSubmissions(user, dealId)
    // debugger
    if (envelopes) {
      envelopes = this.mapReviewsToDocuments(envelopes)
      this.setState({
        envelopes,
        envelopesLoading: false
      })
      this.deal.envelopes = envelopes
      // this.deals[this.deal.index] = this.deal
      // AppStore.data.conciergeDeals = this.deals
      // AppStore.emitChange()
    } else
      await this.getEnvelopes(user, dealId)
  }

  async getSubmissions(user, dealId) {
    const action = {
      user,
      dealId,
      type: 'GET_SUBMISSIONS'
    }
    const submissions =
      await ConciergeDispatcher.dispatchSync(action)
    this.setState({
      submissions,
      submissionsLoading: false
    })
  }

  async getEnvelopes(user, dealId) {
    const action = {
      user,
      dealId,
      type: 'GET_ENVELOPES'
    }
    let envelopes =
      await ConciergeDispatcher.dispatchSync(action)
    envelopes = this.mapReviewsToDocuments(envelopes)
    this.setState({
      envelopes,
      envelopesLoading: false
    })
    this.deal.envelopes = envelopes
    this.deals[this.deal.index] = this.deal
    // AppStore.data.conciergeDeals = this.deals
    // AppStore.emitChange()
  }

  async submitReview(review) {
    const { user } = this.props
    const { id, comment, state } = review
    const body = {
      state,
      comment
    }
    const action = {
      id,
      body,
      user,
      type: 'SET_REVIEW'
    }
    this.setState({
      modalIsFreezed: true
    })

    await ConciergeDispatcher.dispatchSync(action)

    this.setState({
      modalIsFreezed: false,
      modalIsActive: false
    })
  }

  modalSubmitHandler(review) {
    const { type, comment, id } = review
    switch (type) {
      case 'APPROVE':
        this.submitReview({
          id,
          comment,
          state: 'Approved'
        })
        break
      case 'DECLINE':
        this.submitReview({
          id,
          comment,
          state: 'Rejected'
        })
        break
      default:
        this.setState({
          modalActive: false
        })
    }
  }

  modalCloseHandler() {
    this.setState({ modalActive: false })
  }

  approveHandler(selectedReviewId) {
    this.setState({
      selectedReviewId,
      modalIsActive: true,
      modalType: 'APPROVE',
      modalTitle: 'Hurrah! Smooth sailing.'
    })
  }

  declineHandler(selectedReviewId) {
    this.setState({
      selectedReviewId,
      modalIsActive: true,
      modalType: 'DECLINE',
      modalTitle: 'Why has this document been declined?'
    })
  }

  goBack() {
    browserHistory.push('/dashboard/concierge/deals')
  }

  render() {
    const {
      files,
      envelopes,
      submissions,
      envelopesLoading,
      submissionsLoading
    } = this.state
    const token = this.props.user.access_token
    return (
      <div className="list">

        <h4 className="c-concierge__header">
          <span onClick={() => this.goBack()}>
            <i className="fa fa-angle-left" />
            <span>Deals List</span>
          </span>
        </h4>

        <Row>
          <SubmissionsList
            loading={submissionsLoading}
            submissions={submissions}
          />
          <EnvelopesList
            token={token}
            list={envelopes}
            loading={envelopesLoading}
            declineHandler={(id) => {
              this.declineHandler(id)
            }}
            approveHandler={(id) => {
              this.approveHandler(id)
            }}
          />
          <FilesList
            list={files}
            declineHandler={(id) => {
              this.declineHandler(id)
            }}
            approveHandler={(id) => {
              this.approveHandler(id)
            }}
          />
        </Row>

        <Modal
          type={this.state.modalType}
          title={this.state.modalTitle}
          isActive={this.state.modalIsActive}
          isFreezed={this.state.modalIsFreezed}
          closeHandler={this.modalCloseHandler}
          submitHandler={this.modalSubmitHandler}
          selectedReviewId={this.state.selectedReviewId}
        />
      </div>
    )
  }
}
