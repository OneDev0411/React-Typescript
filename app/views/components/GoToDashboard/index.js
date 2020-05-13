import { useEffect } from 'react'
import { browserHistory } from 'react-router'
import { connect } from 'react-redux'

import { getUserDefaultHomepage } from '../../../utils/get-default-home-page'

function GoToDashboard(props) {
  let to = '/signin'

  if (props.user) {
    to = getUserDefaultHomepage(props.user)
  }

  useEffect(() => {
    browserHistory.push(to)
  }, [to])

  return null
}

export default connect(({ user }) => ({ user }))(GoToDashboard)
