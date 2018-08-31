import React from 'react'
import PDFJS from 'pdfjs-dist';

class Text extends React.Component {
  render() {
    const { rect, fontSize, font, bold, color, text } = this.props

    const style = {
      fontSize: (fontSize),
      fontFamily: font,
      color: color,
      fontWeight: bold ? 'bold' : 'normal',
      position: 'absolute',
      left: rect.left,
      top: rect.top,
      width: rect.width,
      height: rect.height,
    }

    return (
      <div
        type="text"
        style={style}
      >
        {text}
      </div>
    )
  }
}


export default Text
