import React, { useEffect } from 'react'
import { Link, browserHistory } from 'react-router'
import { connect } from 'react-redux'

import getDefaultHomePage from '../../../utils/get-default-home-page'

function GoToDashboard(props) {
  const to = getDefaultHomePage(props.user)

  useEffect(() => {
    browserHistory.push(to)
  }, [to])

  return (
    <p>
      Redirecting to <Link to={to}>dashboard</Link>
    </p>
  )
}

export default connect(({ user }) => ({ user }))(GoToDashboard)
