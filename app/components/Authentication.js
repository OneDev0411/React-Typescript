import React from 'react'
import { connect } from 'react-redux'

class Authentication extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    let { data, location, children } = this.props

    data = {
      ...data,
      location,
      path: location.pathname
    }

    const elements = React.cloneElement(children, {
      data,
      user: data.user
    })

    return (
      <div>
        {elements}
      </div>
    )
  }
}

export default connect(({ data }) => ({ data }))(Authentication)
