import React from 'react'

import { connect } from 'react-redux'

const SocketStatus = ({ status }) => {
  if (status === 'connected') {
    return false
  }

  return (
    <div className="socket-status">
      {status}
      <img alt="status" src="/static/images/loading-states/three-dots.svg" />
    </div>
  )
}

export default connect(({ socket }) => ({
  status: socket.status
}))(SocketStatus)
