import React from 'react'
import Avatar from 'react-avatar'
import { Modal, Button } from 'react-bootstrap'
import Document from './submit-review-modal-review-item'

export default class SubmitReviewModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedDocuments: 0
    }

    this.selectedHandler = this.selectedHandler.bind(this)
    this.onHidden = this.onHidden.bind(this)
  }

  componentWillMount() {
    this.state = {
      selectedDocuments: 0
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
    this.props.closeHandler()
    this.setState({
      selectedDocuments: 0
    })
  }

  render() {
    const isFreezed = false
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
            onSubmit={(e) => {
              e.preventDefault()
            }}
          >
            <div className="c-request-review-modal__list">
              <Document
                id="01"
                fileUrl="#"
                avatar={{
                  type: 'pdf',
                  url: ''
                }}
                state="Rejected"
                onSelectedHandler={this.selectedHandler}
                title="Residential Data Input Form"
              />
              <Document
                id="02"
                fileUrl="#"
                avatar={{
                  type: 'pdf',
                  url: ''
                }}
                state="Approved"
                onSelectedHandler={this.selectedHandler}
                title="One to Four Family Contract (Resale)"
              />
              <Document
                id="03"
                fileUrl="#"
                avatar={{
                  type: 'pdf',
                  url: ''
                }}
                state="unclear"
                onSelectedHandler={this.selectedHandler}
                title="Lead-Based Paint Addendum"
              />
              <Document
                id="04"
                fileUrl="#"
                avatar={{
                  type: 'pdf',
                  url: ''
                }}
                state="unclear"
                onSelectedHandler={this.selectedHandler}
                title="Amendment to Contract"
              />
              <Document
                id="05"
                fileUrl="#"
                avatar={{
                  type: 'img',
                  src: '#'
                }}
                state="unclear"
                onSelectedHandler={this.selectedHandler}
                title="bedroom.jpg"
              />
              <Document
                id="06"
                fileUrl="#"
                avatar={{
                  type: 'img',
                  src: '#'
                }}
                state="unclear"
                onSelectedHandler={this.selectedHandler}
                title="bathroom paint.jpg"
              />
              <Document
                id="07"
                fileUrl="#"
                avatar={{
                  type: 'pdf',
                  src: '#'
                }}
                state="unclear"
                onSelectedHandler={this.selectedHandler}
                title="Insurance title.pdf"
              />
              <Document
                id="08"
                fileUrl="#"
                avatar={{
                  type: 'img',
                  src: '#'
                }}
                state="unclear"
                onSelectedHandler={this.selectedHandler}
                title="bedroom.jpg"
              />
              <Document
                id="06"
                fileUrl="#"
                avatar={{
                  type: 'img',
                  src: '#'
                }}
                state="unclear"
                onSelectedHandler={this.selectedHandler}
                title="bathroom paint.jpg"
              />
              <Document
                id="07"
                fileUrl="#"
                avatar={{
                  type: 'pdf',
                  src: '#'
                }}
                state="unclear"
                onSelectedHandler={this.selectedHandler}
                title="Insurance title.pdf"
              />
              <Document
                id="08"
                fileUrl="#"
                avatar={{
                  type: 'img',
                  src: '#'
                }}
                state="unclear"
                onSelectedHandler={this.selectedHandler}
                title="bedroom.jpg"
              />
            </div>
            <div className="c-request-review-modal__footer">
              <span className="c-request-review-modal__footer__caption">
                <b>{this.state.selectedDocuments || 0}</b>
                <span> document selected</span>
              </span>
              <Button
                tabIndex="0"
                type="submit"
                bsStyle="primary"
                disabled={isFreezed}
                className="c-request-review-modal__submit-btn"
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