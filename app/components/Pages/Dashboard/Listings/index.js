import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Helmet } from 'react-helmet'
import { Box } from '@material-ui/core'

class Listings extends Component {
  render() {
    const { user } = this.props

    // Layout is made with flex. For the big picture, checkout the sample:
    // https://codepen.io/mohsentaleb/pen/jOPeVBK
    return (
      <>
        <Helmet>
          <title>Properties | Rechat</title>
        </Helmet>
        <Box
          display="flex"
          flexDirection="column"
          flexWrap="nowrap"
          height="100%"
        >
          {user
            ? React.Children.map(this.props.children, child =>
                React.cloneElement(child)
              )
            : this.props.children}
        </Box>
      </>
    )
  }
}

export default connect(({ user }) => ({ user }))(Listings)
