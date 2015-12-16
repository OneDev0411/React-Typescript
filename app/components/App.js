// App.js

// Build stlye sheet
if(process.env.NODE_ENV === 'build'){
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
  
  _onChange() {
    this.setState(AppStore)
  }

  // Add change listeners to stores
  componentDidMount() {
    AppStore.addChangeListener(this._onChange.bind(this))
  }

  // Remove change listeners from stores
  componentWillUnmount() {
    AppStore.removeChangeListener(this._onChange.bind(this))
  }

  render(){
    
    let data = AppStore.data
    
    // Rehydrate store if coming from server
    if(typeof window !== 'undefined' && window.AppStore){
      data = window.AppStore.data
    }

    let Routes = React.cloneElement(this.props.children, { data: data })
    return Routes
  }
}