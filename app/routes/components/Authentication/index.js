import React from 'react'
import { connect } from 'react-redux'

class Authentication extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    let { user, data, location, children } = this.props

    data = {
      ...data,
      user,
      location,
      path: location.pathname
    }

    const elements = React.cloneElement(children, {
      data,
      user,
      location
    })

    return <div>{elements}</div>
  }
}

export default connect(({ data, user }) => ({ data, user }))(Authentication)
