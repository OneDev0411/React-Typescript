import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Helmet } from 'react-helmet'

class Listings extends Component {
  render() {
    const { user } = this.props

    return (
      <React.Fragment>
        <Helmet>
          <title>Properties | Rechat</title>
        </Helmet>
        <div>
          {user
            ? React.Children.map(this.props.children, child =>
                React.cloneElement(child)
              )
            : this.props.children}
        </div>
      </React.Fragment>
    )
  }
}

export default connect(({ user }) => ({ user }))(Listings)
