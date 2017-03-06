// Dashboard/Partials/DropzoneOverlay.js
import React, { Component } from 'react'
import S from 'shorti'
export default class DropzoneOverlay extends Component {
  render() {
    let overlay_class = ' hidden'
    if (this.props.overlay_active)
      overlay_class = ' active'
    let arrow_area = ''
    if (this.props.context === 'transaction') {
      arrow_area = (
        <div style={ S('absolute t-90 r-130n') }>
          <img src="/static/images/dashboard/transactions/drop-arrow.png"/>
        </div>
      )
    }
    return (
      <div className={ 'dropzone__overlay' + overlay_class }>
        <div style={ S('w-100p h-100p text-center fixed t-0 l-0 z-1') } className="dropzone__bg"></div>
        <div style={ S('w-100p h-100p text-center fixed t-0 l-0 z-2') } className="flexbox dropzone--message">
          <div className="center-block" style={ S('relative p-20 mt-20p w-700 h-300 bg-fff br-2 color-929292') }>
            { arrow_area }
            <div style={ S('h-110 relative t-60n') }>
              <img src="/static/images/dashboard/transactions/drop-here.png"/>
            </div>
            <div style={ S('font-36 mb-10') }>Drop to add to <br/><span className="text-primary">{ this.props.title }</span></div>
            <div style={ S('font-20') }>Drop files like pdfs, word docs and images</div>
          </div>
        </div>
      </div>
    )
  }
}

// Proptypes
DropzoneOverlay.propTypes = {
  overlay_active: React.PropTypes.bool,
  title: React.PropTypes.string,
  context: React.PropTypes.string
}
