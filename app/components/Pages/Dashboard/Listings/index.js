import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Helmet } from 'react-helmet'

class Listings extends Component {
  state = {
    isSideMenuOpen: !!this.props.user
  }

  toggleSideMenu = () =>
    this.setState(state => ({
      isSideMenuOpen: !state.isSideMenuOpen
    }))

  render() {
    const { user } = this.props
    const { isSideMenuOpen } = this.state

    return (
      <React.Fragment>
        <Helmet>
          <title>Properties | Rechat</title>
        </Helmet>
        <div
          className={`l-listings ${user ? 'l-listings--logged' : ''}`}
          style={{ padding: 0 }}
        >
          {user
            ? React.Children.map(this.props.children, child =>
                React.cloneElement(child, {
                  isSideMenuOpen,
                  toggleSideMenu: this.toggleSideMenu
                })
              )
            : this.props.children}
        </div>
      </React.Fragment>
    )
  }
}

export default connect(({ user }) => ({ user }))(Listings)
