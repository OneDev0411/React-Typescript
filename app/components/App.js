// App.js
// Build stlye sheet
if (process.env.WEBPACK_PROCESS === 'build') {
  // Fonts
  require('../src/fonts/sf.scss')
  require('../src/fonts/tempos-headline.scss')
  // Style
  require('../src/sass/main.scss')
}

import React, { Component } from 'react'

// Store
import AppStore from '../stores/AppStore'

export default class App extends Component {

  // Add change listeners to stores
  componentDidMount() {
    AppStore.addChangeListener(this._onChange.bind(this))
  }

  // Remove change listeners from stores
  componentWillUnmount() {
    AppStore.removeChangeListener(this._onChange.bind(this))
  }

  _onChange() {
    this.setState(AppStore)
  }

  render() {
    let data = AppStore.data
    const path = this.props.location.pathname
    data.path = path
    // Hydrate store if coming from server
    if (typeof window !== 'undefined' && window.AppStore) {
      const server_data = window.AppStore.data
      // merge into client
      data = { ...data, ...server_data }
    }
    const Routes = React.cloneElement(this.props.children, { data })
    return Routes
  }
}

// PropTypes
App.propTypes = {
  children: React.PropTypes.object.isRequired,
  location: React.PropTypes.object.isRequired
}