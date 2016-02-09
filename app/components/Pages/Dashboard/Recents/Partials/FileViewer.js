// Dashboard/Recents/FileViewer.js
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import S from 'shorti'

export default class FileViewer extends Component {

  componentDidMount() {
    // Esc to close
    document.onkeydown = evt => {
      if (evt.keyCode === 27)
        this.props.closeFileViewer()
    }
    const data = this.props.data
    const current_room = data.current_room
    const file = current_room.viewer.file
    history.pushState(null, null, '/dashboard/recents/' + current_room.id + '/file/' + file.url)
    // fade in component
    this.fadeIn()
  }

  fadeIn() {
    const elem = ReactDOM.findDOMNode(this)
    elem.style.opacity = 0
    window.requestAnimationFrame(() => {
      elem.style.transition = 'opacity 250ms'
      elem.style.opacity = 1
    })
  }

  render() {
    // Data
    const data = this.props.data
    const current_room = data.current_room
    let title
    let file_url
    if (current_room.viewer && current_room.viewer.file) {
      const file = current_room.viewer.file
      file_url = file.url
      title = file_url
    }
    const viewer_wrap_style = S('fixed w-100p h-100p bg-fff t-0 l-0 z-1000')
    const nav_bar_style = { ...S('mb-0 p-0 h-58 pt-3 w-100p'), borderBottom: '1px solid #e7e4e3' }
    return (
      <div style={ viewer_wrap_style }>
        <div onClick={ this.props.closeFileViewer } style={ S('absolute r-20 t-5 font-40 fw-400') } className="close">&times;</div>
        <div className="bg-aqua" style={ nav_bar_style }>
          <div style={ S('mt-13 font-18') } className="text-center">{ title }</div>
        </div>
        <iframe frameBorder={ 0 } src={ file_url } style={ S('w-100p h-100p absolute') }></iframe>
      </div>
    )
  }
}

// PropTypes
FileViewer.propTypes = {
  data: React.PropTypes.object,
  closeFileViewer: React.PropTypes.func
}