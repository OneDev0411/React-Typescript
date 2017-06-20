import React from 'react'
import { connect } from 'react-redux'

class Authentication extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {

  }

  render() {
    const { data, location } = this.props

    const path = location.pathname
    data.path = path
    data.location = location

    const children = React.cloneElement(this.props.children, {
      data,
      user: data.user
    })

    return (
      <div>{ children }</div>
    )
  }
}

export default connect(s => ({
  data: s.data,
}))(Authentication)
