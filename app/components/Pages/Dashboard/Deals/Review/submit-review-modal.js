import React from 'react'
import Avatar from 'react-avatar'
import { Modal, Button } from 'react-bootstrap'
import config from '../../../../../../config/public'
import Document from './submit-review-modal-review-item'

const getDocumentUrl = (id, index, token) => {
  const baseUrl = `${config.app.url}/api/deals/envelope/preview`
  return `${baseUrl}?id=${id}&index=${index}&access_token=${token}`
}

const getSortedDocs = (docs) => {
  // temporary array holds objects with position and sort-value
  let reviewedDocs = []
  let unreviewedDocs = []
  docs.forEach((doc) => {
    if (doc.review) reviewedDocs.push(doc)
    else unreviewedDocs.push(doc)
  })

  // sorting the mapped array containing the reduced values
  return [
    ...unreviewedDocs.sort((a, b) => (a.name || a.title > b.name || b.title)),
    ...reviewedDocs.sort((a, b) => (a.review.state > b.review.state))
  ]
}

export default class SubmitReviewModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedDocuments: 0
    }

    this.selectedHandler = this.selectedHandler.bind(this)
    this.onHidden = this.onHidden.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.isActive) {
      this.setState({
        selectedDocuments: 0
      })
    }
  }

  selectedHandler(isSelected) {
    this.setState({
      selectedDocuments: isSelected
        ? this.state.selectedDocuments + 1
        : this.state.selectedDocuments - 1
    })
  }

  onHidden() {
    const isClosed = this.props.closeHandler()
    if (isClosed) {
      this.setState({
        selectedDocuments: 0
      })
    }
  }

  onSubmit(e) {
    e.preventDefault()
    const form = e.target

    const docs = Object.keys(form)
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

    this.props.submitHandler(docs)
  }

  render() {
    const { isFreezed } = this.props
    const { selectedDocuments } = this.state
    return (
      <Modal className="c-request-review-modal" show={this.props.isActive} onHide={this.onHidden}>
        <Modal.Header>
          <Modal.Title>{'Send docs for borker review'}</Modal.Title>
          <button
            onClick={this.onHidden}
            className="c-request-review-modal__close-btn"
          >
            <svg fill="#2196f3" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" /><path d="M0 0h24v24H0z" fill="none" /></svg>
          </button>
        </Modal.Header>
        <Modal.Body>
          <form
            name="concierge-review"
            onSubmit={this.onSubmit.bind(this)}
          >
            <div
              className={
                `c-request-review-modal__list ${
                  isFreezed ? 'is-inactive' : ''
                }`
              }
            >
              {
                getSortedDocs(this.props.documents).map((doc) => {
                  let type = ''
                  let title = ''
                  let docUrl = ''
                  let avatar = {}
                  let state = doc.review ? doc.review.state : 'unclear'

                  if (doc.type === 'file') {
                    docUrl = doc.url
                    title = doc.name
                    avatar.type = doc.mime === 'application/pdf' ? 'pdf' : 'img'
                    avatar.src = avatar.type === 'img' ? doc.url : '#'
                  } else {
                    title = doc.title
                    docUrl = getDocumentUrl(
                      doc.envelope,
                      doc.index,
                      this.props.token
                    )
                  }

                  return (
                    <Document
                      key={`DOC_${doc.id}`}
                      id={doc.id}
                      type={doc.type}
                      title={title}
                      state={state}
                      avatar={avatar}
                      fileUrl={docUrl}
                      onSelectedHandler={this.selectedHandler}
                      onFilePreviewModalShowHandler={this.props.filePreviewModalShowHandler}
                    />
                  )
                })
              }
            </div>
            <div className="c-request-review-modal__footer">
              <span className="c-request-review-modal__footer__caption">
                <b>{selectedDocuments}</b>
                <span> document selected</span>
              </span>
              <Button
                tabIndex="0"
                disabled={selectedDocuments === 0 || isFreezed}
                type="submit"
                bsStyle="primary"
                className={
                  `c-request-review-modal__submit-btn ${selectedDocuments === 0 || isFreezed ? 'is-inactive' : ''}`
                }
              >
                {isFreezed ? 'Sending...' : 'Submit for review'}
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    )
  }
}
