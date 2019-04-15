import React from 'react'
import ReactModal from 'react-modal'
import cn from 'classnames';
import PropTypes from 'prop-types'

export default class BareModal extends React.Component {
  render() {
    const classes = cn('c-modal__content', this.props.className, {
      'modal__content--padding': this.props.padding,
      'modal__content--height-auto': this.props.autoHeight
    })

    return (
      <ReactModal
        {...this.props}
        className={classes}
        overlayClassName={`c-modal__overlay ${this.props.overlayClassName}`}
      >
        {this.props.children}
      </ReactModal>
    )
  }
}

BareModal.propTypes = {
  padding: PropTypes.bool,
  autoHeight: PropTypes.bool,
  className: PropTypes.string,
}
