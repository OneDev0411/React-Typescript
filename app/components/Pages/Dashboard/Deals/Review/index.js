import React from 'react'
import FilePreviewModal from './file-preview-modal'
import SubmitReviewModal from './submit-review-modal'
import ConciergeDispatcher from '../../../../../dispatcher/ConciergeDispatcher'
import MessageModal from '../../../../Partials/MessageModal'

// const serializeFormToObject = (form) => {
//   let obj = {}
//   let checkedCheckboxs = []
//   const files = form.elements.file
//   const envelopes = form.elements.envelope_document

//   if (envelopes) {
//     if (Array.isArray(envelopes)) {
//       checkedCheckboxs = [
//         ...checkedCheckboxs,
//         ...form.elements.envelopes
//       ]
//     } else checkedCheckboxs.push(envelopes)
//   }

//   if (files) {
//     if (Array.isArray(files)) {
//       checkedCheckboxs = [
//         ...checkedCheckboxs,
//         ...form.elements.files
//       ]
//     } else checkedCheckboxs.push(files)
//   }

//   checkedCheckboxs = checkedCheckboxs.filter(
//     element => element.type === 'checkbox' && element.checked
//   )

//   return checkedCheckboxs.map((checkbox) => {
//     let obj = {}
//     obj[checkbox.name] = checkbox.id
//     obj.state = 'Pending'
//     return obj
//   })
// }

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
      // reviewRequestModalIsActive: false,
      // reviewRequestModalIsFreezed: false,
      // filePreviewModalContent: '',
      // filePreviewModalIsActive: false,
      // allReviewableDocs: null,
      // showSuccessModal: false
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
  //   if (!this.state.reviewRequestModalIsFreezed) {
  //     // browserHistory.push(`/dashboard/deals/${this.props.params.id}`)
  //     this.setState({
  //       reviewRequestModalIsActive: false
  //     })
  //   }
  // }
  // reviewRequestModalShowHandler() {
  //   this.setState({
  //     reviewRequestModalIsActive: true
  //   })
  // }

  // async reviewRequestSubmit(docs) {
  //   const token = this.props.user.access_token
  //   const { id } = this.props.params
  //   const body = {
  //     reviews: docs
  //   }
  //   const action = {
  //     id,
  //     body,
  //     token,
  //     type: 'SUBMIT_REVIEW_REQUEST'
  //   }
  //   const reviews = await ConciergeDispatcher.dispatchSync(action)
  //   reviews.forEach((review) => {
  //     const type = review.file ? 'FILE' : 'ENVELOPE'
  //     switch (type) {
  //       case 'FILE':
  //         if (this.state.files) {
  //           const files = this.state.files.map((file) => {
  //             if (file.id !== review.file) return file

  //             file.review = review
  //             return file
  //           })
  //           this.setState({ files })
  //         }
  //         break
  //       case 'ENVELOPE':
  //         if (this.state.envelopes) {
  //           const envelopes = this.state.envelopes.map((envelope) => {
  //             if (!envelope.documents) return envelope

  //             const documents = envelope.documents.map((document) => {
  //               document.review = review
  //               return document
  //             })
  //             return {
  //               ...envelope,
  //               documents
  //             }
  //           })
  //           this.setState({ envelopes })
  //         }
  //         break
  //     }
  //   })
  //   this.setState({
  //     showSuccessModal: true,
  //     reviewRequestModalIsActive: false,
  //     reviewRequestModalIsFreezed: false
  //   })
  //   setTimeout(() => {
  //     this.setState({
  //       showSuccessModal: false
  //     })
  //   }, 1500)
  // }

  // reviewRequestModalSubmitHandler(form) {
  //   this.setState({
  //     reviewRequestModalIsFreezed: true
  //   })
  //   const docs = serializeFormToObject(form)
  //   this.reviewRequestSubmit(docs)
  // }

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
    let docs = []

    if (envelopes) {
      // allReviewableDocs = [
      //   ...this.preparedEnvelopes(envelopes)
      // ]
      docs = docs.concat(this.preparedEnvelopes(envelopes))
    }

    if (files) {
      // allReviewableDocs = [
      //   ...allReviewableDocs,
      //   ...files
      // ]
      docs = docs.concat(files)
    }

    return docs
  }

  render() {
    return (
      <div>
        <MessageModal
          show={this.state.showSuccessModal}
          text="Documents submitted for review!"
        />
      </div>
    )
  }
}
