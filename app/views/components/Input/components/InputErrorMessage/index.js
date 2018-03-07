import React from 'react'

export default ({ message }) => (
  <span
    style={{ position: 'absolute', right: '5px', top: '30%' }}
    data-balloon={message}
    data-balloon-pos="up"
  >
    <i
      style={{
        verticalAlign: 'middle',
        fontSize: '18px',
        color: '#ec4b35'
      }}
      className="fa fa-warning"
    />
  </span>
)
