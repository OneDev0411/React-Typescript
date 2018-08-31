import React from 'react'

export default function Text(props) {
  const { rect, fontSize, font, bold, color, text } = props

  const style = {
    fontSize,
    fontFamily: font,
    color,
    fontWeight: bold ? 'bold' : 'normal',
    position: 'absolute',
    left: rect.left,
    top: rect.top,
    width: rect.width,
    height: rect.height
  }

  return (
    <div type="text" style={style}>
      {text}
    </div>
  )
}
