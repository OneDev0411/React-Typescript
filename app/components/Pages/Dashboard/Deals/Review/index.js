import React from 'react'
import FilePreviewModal from './file-preview-modal'
import SubmitReviewModal from './submit-review-modal'
import MessageModal from '../../../../Partials/MessageModal'
import ConciergeDispatcher from '../../../../../dispatcher/ConciergeDispatcher'

export default class DealDashboard extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      deal: props.deal,
      showSuccessModal: false,
      allReviewableDocs: null,
      filePreviewModalContent: '',
      filePreviewModalIsActive: false,
      saving: false,
    }
  }

  componentDidMount() {
    const { deal } = this.props
    this.initializeReviews(deal)
  }

  componentWillReceiveProps(nextProps) {
    const { deal } = nextProps
    this.initializeReviews(deal)
  }

  initializeReviews(deal) {
    if (deal.reviewsIsMapped)
      return false

    let indexedReviews = null

    if (deal.reviews && !deal.reviewsIsMapped) {
      indexedReviews = this.indexedReviewsByDocumentsId(deal.reviews)

      // this flag prevent to next review mapping process
      deal.reviewsIsMapped = true

      if (deal.files) {
        deal.files = this.mapReviewsToFiles(indexedReviews, deal.files)
      }
    }

    if (deal.envelopes && indexedReviews) {
      deal.envelopes = this.mapReviewsToDocuments(indexedReviews, deal.envelopes)
    }

    if (deal.reviews) {
      this.setState({ deal })
      this.props.onChange(deal)
    }
  }

  indexedReviewsByDocumentsId(reviews) {
    let indexedReviews = {}

    reviews.forEach((review) => {
      const id = review.file || review.envelope_document
      indexedReviews[id] = {
        ...review
      }
    })

    return indexedReviews
  }

  mapReviewsToFiles(reviews, files) {
    return files.map((file) => {
      const review = reviews[file.id] || null
      return {
        ...file,
        review
      }
    })
  }

  mapReviewsToDocuments(reviews, envelopes) {
    return envelopes.map((envelope) => {
      if (!envelope.documents)
        return envelope

      const documents = envelope.documents.map((doc) => {
        const review = (reviews && reviews[doc.id]) || null
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

  async postReview(docs) {
    const token = this.props.user.access_token
    const { deal } = this.state

    const reviews = await ConciergeDispatcher.dispatchSync({
      type: 'SUBMIT_REVIEW_REQUEST',
      id: deal.id,
      body: {
        reviews: docs
      },
      token
    })

    reviews.forEach(review => {
      const type = review.file ? 'FILE' : 'ENVELOPE'

      if (type === 'FILE' && deal.files) {

        deal.files = deal.files.map(file => {
          if (file.id !== review.file)
            return file

          file.review = review
          return file
        })
      }

      if (type === 'ENVELOPE' && deal.envelopes) {

        deal.envelopes = deal.envelopes.map(envelope => {
          if (!envelope.documents)
            return envelope

          const documents = envelope.documents.map(document => {
            if (document.id === review.envelope_document)
              document.review = review

            return document
          })

          return {
            ...envelope,
            documents
          }
        })
      }
    })

    this.setState({
      deal,
      showSuccessModal: true,
      saving: false
    })

    setTimeout(() => this.setState({ showSuccessModal: false }), 1500)

    this.onClose()
  }

  reviewRequestModalSubmitHandler(docs) {
    this.setState({
      saving: true
    })

    this.postReview(docs)
  }

  preparedEnvelopes(envelopes) {
    let list = []

    envelopes.map((envelope) => {
      if (!envelope.documents)
        return

      envelope.documents.forEach((document, index) => list.push({...document, index }))
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

  onClose() {
    if (!this.state.saving)
      this.props.onClose()
  }

  render() {
    const { deal } = this.state
    const allReviewableDocs = this.getAllReviewableDocs(deal.envelopes, deal.files)

    return (
      <div>
        <SubmitReviewModal
          isActive={this.props.show}
          documents={allReviewableDocs}
          token={this.props.user.access_token}
          closeHandler={() => this.onClose()}
          isFreezed={this.state.saving}
          submitHandler={docs => this.reviewRequestModalSubmitHandler(docs)}
          filePreviewModalShowHandler={file => this.filePreviewModalShowHandler(file)}
        />

        <FilePreviewModal
          file={this.state.filePreviewModalContent}
          isActive={this.state.filePreviewModalIsActive}
          onCloseHandler={() => this.filePreviewModalCloseHandler()}
        />

        <MessageModal
          show={this.state.showSuccessModal}
          text="Documents submitted for review!"
        />
      </div>
    )
  }
}
