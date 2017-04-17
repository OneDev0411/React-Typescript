
import S from 'shorti'
import React from 'react'
import Modal from './Modal'
import ListTitle from './ListTitle'
import FilesList from './FilesList'
import EnvelopesList from './EnvelopesList'
import SubmissionsList from './SubmissionsList'
import { browserHistory, Link } from 'react-router'
import config from '../../../../../../config/public'
import { Grid, Row, Col, Button } from 'react-bootstrap'
import ConciergeDispatcher from '../../../../../dispatcher/ConciergeDispatcher'


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
    this.reviews = {}

    this.state = {
      files: [],
      envelopes: [],
      submissions: [],
      envelopesLoading: true,
      submissionsLoading: true,
      modalType: '',
      modalTitle: '',
      modalActive: false
    }

    this.modalCloseHandler = this.modalCloseHandler.bind(this)
    this.modalSubmitHandler = this.modalSubmitHandler.bind(this)
  }

  componentDidMount() {
    this.getDeal().then((deal) => {
      this.deal = deal
      this.fillreviews()

      if (deal.files) {
        const files = this.mapReviewsToFiles(deal.files)
        this.setState({ files })
      }

      this.getAll()
    })
  }

  async getDeal() {
    const dealId = this.props.params.id
    const deals = this.props.conciergeDeals
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
    const deals = this.props.conciergeDeals

    let { submissions } = deals[this.deal.index]
    let { envelopes } = deals[this.deal.index]

    if (submissions) {
      this.setState({
        submissions,
        submissionsLoading: false
      })
    } else
      await this.getSubmissions(user, dealId)

    if (envelopes) {
      envelopes = this.mapReviewsToDocuments(envelopes)
      this.setState({
        envelopes,
        envelopesLoading: false
      })
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
  }

  modalSubmitHandler(action) {
    switch (action.type) {
      case 'APPROVE':
        this.approveDocuments(action.comment)
        break
      case 'DECLINE':
        this.declineDocuments()
        break
      default:
        this.setState({
          modalActive: false
        })
    }
  }

  approveDocuments(comment) {
    console.log(comment)
  }

  declineDocuments() {

  }

  modalCloseHandler() {
    this.setState({ modalActive: false })
  }

  render() {
    const {
      files,
      envelopes,
      submissions,
      envelopesLoading,
      submissionsLoading
    } = this.state
    const approveState = {
      modalActive: true,
      modalType: 'DECLINE',
      modalTitle: 'Why has this document been declined?'
    }
    const declineState = {
      modalActive: true,
      modalType: 'APPROVE',
      modalTitle: 'Hurrah! Smooth sailing.'
    }
    const token = this.props.user.access_token
    return (
      <div className="list c-concierge">
        <EnvelopesList
          token={token}
          list={envelopes}
          loading={envelopesLoading}
          declineHandler={() => this.setState(declineState)}
          approveHandler={() => this.setState(approveState)}
        />
        <SubmissionsList
          loading={submissionsLoading}
          submissions={submissions}
        />
        <FilesList
          list={files}
          declineHandler={() => this.setState(declineState)}
          approveHandler={() => this.setState(approveState)}
        />
        <Modal
          title={this.state.modalTitle}
          isActive={this.state.modalActive}
          closeHandler={this.modalCloseHandler}
          submitHandler={this.modalSubmitHandler}
        />
      </div>
    )
  }
}
