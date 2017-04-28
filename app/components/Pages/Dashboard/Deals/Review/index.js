import React from 'react'
import FilePreviewModal from './file-preview-modal'
import SubmitReviewModal from './submit-review-modal'
import MessageModal from '../../../../Partials/MessageModal'
import AppStore from '../../../../../stores/AppStore'
import ConciergeDispatcher from '../../../../../dispatcher/ConciergeDispatcher'

const serializeFormToObject = form => Object.keys(form)
  .filter(key =>
    form[key].type === 'checkbox'
    && form[key].checked
  )
  .map(index => form[index])
  .map((checkbox) => {
    let doc = {
      state: 'Pending'
    }
    doc[checkbox.name] = checkbox.id
    return doc
  })


export default class DealDashboard extends React.Component {

  constructor(props) {
    super(props)
    this.deal = props.deal || null

    this.state = {
      showSuccessModal: false,
      allReviewableDocs: null,
      filePreviewModalContent: '',
      files: this.deal.files || null,
      filePreviewModalIsActive: false,
      reviewRequestModalIsFreezed: false,
      envelopes: this.deal.envelopes || null
    }

    this.reviewRequestModalCloseHandler =
      this.reviewRequestModalCloseHandler.bind(this)
    this.reviewRequestModalSubmitHandler =
      this.reviewRequestModalSubmitHandler.bind(this)
    this.filePreviewModalCloseHandler =
      this.filePreviewModalCloseHandler.bind(this)
    this.filePreviewModalShowHandler =
      this.filePreviewModalShowHandler.bind(this)
  }

  async postReview(docs) {
    const token = this.props.user.access_token
    const { id } = this.deal
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
      reviewRequestModalIsFreezed: false
    })
    this.reviewRequestModalCloseHandler()
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
    this.postReview(docs)
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
    if (!this.state.reviewRequestModalIsFreezed)
      this.props.onClose()
  }

  render() {
    const { envelopes, files } = this.state
    const allReviewableDocs = this.getAllReviewableDocs(envelopes, files)

    return (
      <div>
        <SubmitReviewModal
          isActive={this.props.show}
          documents={allReviewableDocs}
          token={this.props.user.access_token}
          closeHandler={this.reviewRequestModalCloseHandler}
          isFreezed={this.state.reviewRequestModalIsFreezed}
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
