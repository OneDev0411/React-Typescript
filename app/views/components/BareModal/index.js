import React from 'react'
import ReactModal from 'react-modal'

export default class BareModal extends React.Component {
  componentDidMount() {
    if (document) {
      ReactModal.setAppElement('#app')
    }
  }

  render() {
    return (
      <ReactModal
        {...this.props}
        className={`c-modal__content ${this.props.className}`}
        overlayClassName={`c-modal__overlay ${this.props.overlayClassName}`}
      >
        {this.props.children}
      </ReactModal>
    )
  }
}
