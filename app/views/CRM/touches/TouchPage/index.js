import React from 'react'
import { withRouter } from 'react-router'

import Header from './Header'
import TouchForm from '../Touch'

function TouchPage(props) {
  const {
    params: { id }
  } = props

  const title = id && id !== 'new' ? 'Edit' : 'New'

  return (
    <div
      className="c-touch-page"
      style={{
        minHeight: '100vh',
        background: '#f0f4f7'
      }}
    >
      <Header title={`${title} Touch`} />
      <TouchForm touchId={id} />
    </div>
  )
}

export default withRouter(TouchPage)
