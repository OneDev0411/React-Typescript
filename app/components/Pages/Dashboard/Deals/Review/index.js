import React from 'react'
import FilePreviewModal from './file-preview-modal'
import SubmitReviewModal from './submit-review-modal'
import ConciergeDispatcher from '../../../../../dispatcher/ConciergeDispatcher'
import MessageModal from '../../../../Partials/MessageModal'

export default class extends React.Component {

  constructor(props) {
    super(props)
    // const { id } = props.params

    // this.reviews = {}
    // this.deal = props.deals.list[id] || null

    // if (this.deal.reviews) {
    //   this.fillreviews()
    //   if (this.deal.files) this.mapReviewsToFiles()
    // }

    this.state = {
      isActive: false,
      working: false,
      filePreviewModalContent: '',
      filePreviewModalIsActive: false,
      reviewableDocs: null,
      showSuccessModal: false
    }
  }

  componentDidMount() {
    const { envelopes, files } = this.props
    this.getAllReviewableDocs(envelopes, files)
  }

  componentWillReceiveProps(nextProps) {
    const { envelopes, files } = nextProps
    this.getAllReviewableDocs(envelopes, files)
  }

  // fillreviews() {
  //   const reviews = this.deal.reviews
  //   if (reviews) {
  //     this.deal.reviews.forEach((review) => {
  //       const id = review.file || review.envelope_document
  //       this.reviews[id] = {
  //         ...review
  //       }
  //     })
  //   }
  // }

  // mapReviewsToFiles() {
  //   const newFiles = this.deal.files.map((file) => {
  //     const review = this.reviews[file.id] || null
  //     return {
  //       ...file,
  //       review
  //     }
  //   })
  //   this.deal.files = newFiles
  //   AppStore.data.deals.list[this.deal.id] = this.deal
  // }

  // mapReviewsToDocuments(envelopes) {
  //   return envelopes.map((envelope) => {
  //     if (!envelope.documents)
  //       return envelope

  //     const documents = envelope.documents.map((doc) => {
  //       const review = (this.reviews && this.reviews[doc.id]) || null
  //       return {
  //         ...doc,
  //         review
  //       }
  //     })
  //     return {
  //       ...envelope,
  //       documents
  //     }
  //   })
  // }

  // filePreviewModalCloseHandler() {
  //   this.setState({
  //     filePreviewModalIsActive: false
  //   })
  // }

  // filePreviewModalShowHandler(file) {
  //   this.setState({
  //     filePreviewModalIsActive: true,
  //     filePreviewModalContent: file
  //   })
  // }

  // reviewRequestModalCloseHandler() {
  //   if (!this.state.working) {
  //     // browserHistory.push(`/dashboard/deals/${this.props.params.id}`)
  //     this.setState({
  //       isActive: false
  //     })
  //   }
  // }

  // reviewRequestModalShowHandler() {
  //   this.setState({
  //     isActive: true
  //   })
  // }

  async send(docs) {
    const token = this.props.user.access_token
    const { id } = this.props.params

    const reviews = await ConciergeDispatcher.dispatchSync({
      type: 'SUBMIT_REVIEW_REQUEST',
      body: { reviews: docs },
      id,
      token
    })

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
      isActive: false,
      working: false
    })

    setTimeout(() => this.setState({ showSuccessModal: false }), 1500)
  }

  onSubmit(form) {
    console.log(form)
    return
    this.setState({ working: true })
    const docs = serializeFormToObject(form)
    this.send(docs)
  }

  preparedEnvelopes(envelopes) {
    let list = []

    envelopes.forEach((envelope) => {
      if (!envelope.documents)
        return

      envelope.documents.forEach((document, index) => list.push({ ...document, index }))
    })

    return list
  }

  getAllReviewableDocs(envelopes, files) {
    let docs = new Array()

    if (envelopes) {
      docs = docs.concat(this.preparedEnvelopes(envelopes))
    }

    if (files) {
      docs = docs.concat(files)
    }

    this.setState({
      reviewableDocs: docs
    })
  }

  render() {
    const { reviewableDocs } = this.state

    return (
      <div>
        <SubmitReviewModal
          documents={reviewableDocs}
          token={this.props.user.access_token}
          isActive={this.props.show}
          // isFreezed={this.state.reviewRequestModalIsFreezed}
          closeHandler={this.props.onClose}
          submitHandler={form => this.onSubmit(form)}
        />

        <MessageModal
          show={this.state.showSuccessModal}
          text="Documents submitted for review!"
        />
      </div>
    )
  }
}
